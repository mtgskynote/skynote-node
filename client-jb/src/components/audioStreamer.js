/* eslint-disable */
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

import { makeCrepeScriptNode } from './pitch/crepeScriptNode.js';
import Meyda from 'meyda'; //https://meyda.js.org
import {
  getAudioContext,
  suspendAudioContext,
  resumeAudioContext,
} from '../context/audioContext';

const meyda_buff_fft_length = 1024; // fft length and buf size are the same for Meyda

let mediaRecorder = null;
let mediaStream = null;
let audioChunks = [];

var makeAudioStreamer = function (
  pitchCallback,
  pitchVectorCallback,
  analysisCb
) {
  let audioContext = getAudioContext();
  let sourceNode = null;
  let scriptNode = null;
  let gain = null;

  var audioStreamer = {
    // Create an analyser node to extract amplitude data
    analyserNode: audioContext.createAnalyser(),
    pitch: null,
    analyzer: null,
    analyzerCb: analysisCb,

    dismantleAudioNodes: function () {
      console.log('DiSMANTLING audio nodes');
      // Stop all tracks on the audio source
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        mediaStream = null;
        console.log('MediaStream tracks stopped');
      }

      sourceNode && sourceNode.disconnect();
      scriptNode && scriptNode.disconnect();
      this.analyserNode && this.analyserNode.disconnect();
      gain && gain.disconnect();
    },

    init: async function (recordMode, meydaFeatures = []) {
      console.log('meydaFeatures ', meydaFeatures);

      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          latency: { ideal: 0.01, max: 0.05 },
          sampleRate: 22050,
        },
      });

      mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      // mediaRecorder.onstop = () => {
      //   console.log('----------MediaRecorder stopped');
      //   const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      //   const audioUrl = URL.createObjectURL(audioBlob);
      //   const audio = document.getElementById('audioPlayback');
      //   if (! audio) {
      //     console.log('No audio element to play back - Should the audio save dialog box return a file name first, or what ?????');
      //   } else {
      //     audio.src = audioUrl;
      //   }
      //   audioChunks = [];

      // };

      if (recordMode === true) {
        mediaRecorder.start();
        console.log("We're now recording stuff :D");
      }

      resumeAudioContext();
      sourceNode = audioContext.createMediaStreamSource(mediaStream);

      if (typeof Meyda === 'undefined') {
        console.log('Meyda could not be found! Have you included it?');
      } else {
        const analyzer = Meyda.createMeydaAnalyzer({
          audioContext: audioContext,
          source: sourceNode,
          // The docs (https://meyda.js.org/guides/online-web-audio) imply this can be anything, and also that it
          //     determines not just the buffer size, but in fact the rate at which the analyzer gets called.
          bufferSize: meyda_buff_fft_length,
          featureExtractors: meydaFeatures,
          callback: (features) => {
            //console.log(`CALLBACK FEATURES:  +${JSON.parse(features)}`);
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
      console.log('CREPE Buffer size = ' + bufferSize);
      // console.log(
      //   `Setting up a crepescriptnode with pitchcallback  ${pitchCallback}`
      // );
      scriptNode = await makeCrepeScriptNode(
        audioContext,
        bufferSize,
        pitchCallback,
        pitchVectorCallback
      );

      sourceNode.connect(scriptNode);
      console.log(`audioStreamer: OK = pitch node connected!!`);

      // necessary to pull audio throuth the scriptNode???????
      gain = audioContext.createGain();
      gain.gain.setValueAtTime(0, audioContext.currentTime);

      scriptNode.connect(gain);

      gain.connect(audioContext.destination);
    },

    close: function () {
      console.log('audiochunks', audioChunks);
      if (mediaRecorder) {
        console.log('mediaRecorder.state is ', mediaRecorder.state);
        mediaRecorder.stop();
      }

      this.dismantleAudioNodes();
    },

    close_not_save: function () {
      //mediaRecorder.stop();
      // audioContext.suspend();
      this.dismantleAudioNodes();
      suspendAudioContext();
    },
    close_maybe_save: function () {
      mediaRecorder.stop();
      audioStreamer.dismantleAudioNodes();
      //audioContext.suspend();
    },
    save_or_not: async function (answer) {
      if (answer === 'save') {
        //This creates an audioBlob
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
        // Transform audioBlob to audioArray
        try {
          // Convert Blob to ArrayBuffer using await
          const arrayBuffer = await audioBlob.arrayBuffer();
          // Clean
          audioChunks = [];
          this.dismantleAudioNodes();
          suspendAudioContext();
          return arrayBuffer;
        } catch (error) {
          console.error('Error converting Blob to ArrayBuffer:', error);
          // Clean
          audioChunks = [];
          //audioContext.suspend();
          suspendAudioContext();
          return 0;
        }
      }

      audioChunks = [];
      audioContext.suspend();
      suspendAudioContext();
    },
  };

  return audioStreamer;
};

export { makeAudioStreamer };
