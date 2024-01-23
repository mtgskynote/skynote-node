/*
USAGE:
 const audioStreamer = makeAudioStreamer(pitchCallback, pitchVectorCb, analysisCb);
 audioStreamer.init(["rms", "spectralCentroid"]);  //LIST ONLY MEYDA FEATURES (not pitch)  !

  pitchCallBack - a function you define that takes one argument that will be passed an object:
    {pitch : floating-point fundamental frequency,
     confidence: floating point in [0,1]}

  pitchVectorCb - a function that takes one argument which is an array of strengths across different pitches (can be null if you don't care about all the pitch strengths)

  analysisCb - a function that takes one argument, an object with attributes for each Meyda feature you want 

  The array argument to audioStreamer.init are strings naming the Meyda features you want. 
*/

import { makeCrepeScriptNode } from "./pitch/crepeScriptNode.js";
import Meyda from "meyda"; //https://meyda.js.org

const meyda_buff_fft_length = 1024; // fft length and buf size are the same for Meyda

// Create an audio context
const audioContext = new AudioContext({
  latencyHint: "interactive",
  sampleRate: 22050,
}); // must be audioContext.resumed()'d by a user before mic will work.

var mediaRecorder = null;
var audioChunks = [];

var makeAudioStreamer = function (
  pitchCallback,
  pitchVectorCallback,
  analysisCb,
) {
  var audioStreamer = {  
    // Create an analyser node to extract amplitude data
    analyserNode: audioContext.createAnalyser(),
    pitch: null,
    analyzer: null,
    analyzerCb: analysisCb,

    init: function (recordMode, meydaFeatures = []) {
      navigator.mediaDevices
        .getUserMedia({ audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          latency: 0,
          sampleRate: 22050
        } })
        .then(async (stream) => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };

          if (recordMode === true) {
            mediaRecorder.start();
            console.log("We're now recording stuff :D");
          };

          audioContext.resume();
          const sourceNode = audioContext.createMediaStreamSource(stream);

          if (typeof Meyda === "undefined") {
            console.log("Meyda could not be found! Have you included it?");
          } else {
            const analyzer = Meyda.createMeydaAnalyzer({
              audioContext: audioContext,
              source: sourceNode,
              // The docs (https://meyda.js.org/guides/online-web-audio) imply this can be anything, and also that it
              //     determines not just the buffer size, but in fact the rate at which the analyzer gets called.
              bufferSize: meyda_buff_fft_length,
              featureExtractors: meydaFeatures,
              callback: (features) => {
                //console.log(features);
                this.analyzerCb && this.analyzerCb(features);
              },
            });
            analyzer.start();
          }
          // // analyserNode defined in object
          this.analyserNode.fftSize = meyda_buff_fft_length;

          // // Connect the source node to the analyser node
          sourceNode.connect(this.analyserNode);

          // The Crepe script node downsamples to 16kHz
          // We need the buffer size that is a power of two and is longer than 1024 samples when resampled to 16000 Hz.
          // In most platforms where the sample rate is 44.1 kHz or 48 kHz, this will be 4096, giving 10-12 updates/sec.
          const minBufferSize = (audioContext.sampleRate / 16000) * 1024;
          for (var bufferSize = 4; bufferSize < minBufferSize; bufferSize *= 2);
          console.log("CREPE Buffer size = " + bufferSize);
          // console.log(
          //   `Setting up a crepescriptnode with pitchcallback  ${pitchCallback}`
          // );
          const scriptNode = await makeCrepeScriptNode(
            audioContext,
            bufferSize,
            pitchCallback,
            pitchVectorCallback
          );

          sourceNode.connect(scriptNode);
          console.log(`audioStreamer: OK = pitch node connected!!`);

          // necessary to pull audio throuth the scriptNode???????
          const gain = audioContext.createGain();
          gain.gain.setValueAtTime(0, audioContext.currentTime);

          scriptNode.connect(gain);

          gain.connect(audioContext.destination);
        })
    },
    close: function (){
      console.log("audiochunks", audioChunks)
      mediaRecorder.stop();
      console.log("audiochunks", audioChunks)
      
      //audioContext.suspend();
    },    
    close_not_save: function (){
      //mediaRecorder.stop();
      audioContext.suspend();
    },
    close_maybe_save: function (){
      mediaRecorder.stop();
      //audioContext.suspend();
    },
    save_or_not: async function(answer){
      if(answer==="save"){
        //This creates an audioBlob
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        // Transform audioBlob to audioArray
        try {
          // Convert Blob to ArrayBuffer using await
          const arrayBuffer = await audioBlob.arrayBuffer();
          // Clean
          audioChunks = [];
          audioContext.suspend();
          return arrayBuffer;
        } catch (error) {
          console.error('Error converting Blob to ArrayBuffer:', error);
          // Clean
          audioChunks = [];
          audioContext.suspend();
          return 0
        }
      }
      
      audioChunks = [];
      audioContext.suspend();
    },
  };
  
  return audioStreamer;
};



export { makeAudioStreamer };
