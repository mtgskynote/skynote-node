/* eslint-disable */
import { createCrepeWorkletNode } from './createCrepeWorkletNode.js';
import Meyda from 'meyda'; //https://meyda.js.org
import {
  getAudioContext,
  suspendAudioContext,
  resumeAudioContext,
} from '../../context/audioContext.js';

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

  const audioStreamer = {
    // Create an analyser node to extract amplitude data
    analyserNode: audioContext.createAnalyser(),
    pitch: null,
    analyzer: null,
    analyzerCb: analysisCb,
    meydaAnalyzer: null,
    preloaded: false,

    dismantleAudioNodes: function () {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
        mediaStream = null;
      }

      // Disconnect nodes
      sourceNode && sourceNode.disconnect();
      scriptNode && scriptNode.disconnect();
      this.analyserNode && this.analyserNode.disconnect();
      gain && gain.disconnect();

      // Nullify node references to clean up memory
      sourceNode = null;
      scriptNode = null;
      gain = null;
      this.analyserNode = null;
      this.meydaAnalyzer = null;
      this.preloaded = false;

      console.log('Audio nodes dismantled.');
    },

    preload: async function (meydaFeatures = []) {
      // Access audio input (microphone) permissions but do not start recording
      if (!mediaStream) {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false,
            latency: { ideal: 0.01, max: 0.05 },
            sampleRate: 22050,
          },
        });
      }

      // Prepare Web Audio API components
      sourceNode = audioContext.createMediaStreamSource(mediaStream);

      // Initialize the MeydaAnalyzer if present
      if (typeof Meyda === 'undefined') {
        console.log('Meyda could not be found! Have you included it?');
      } else {
        this.meydaAnalyzer = Meyda.createMeydaAnalyzer({
          audioContext: audioContext,
          source: sourceNode,
          bufferSize: meyda_buff_fft_length,
          featureExtractors: meydaFeatures,
          callback: (features) => {
            this.analyzerCb && this.analyzerCb(features);
          },
        });
      }

      // Connect the source node to the analyser node
      this.analyserNode.fftSize = meyda_buff_fft_length;
      sourceNode.connect(this.analyserNode);

      // Prepare CREPE pitch-tracking scriptNode
      const minBufferSize = (audioContext.sampleRate / 16000) * 1024;
      console.log('min buffer size: ' + minBufferSize);
      let bufferSize = 4;
      for (; bufferSize < minBufferSize; bufferSize *= 2);

      // bufferSize /= 2;
      // console.log('buffer size: ' + bufferSize);

      // scriptNode = await makeCrepeScriptNode(
      //   audioContext,
      //   bufferSize,
      //   pitchCallback,
      //   pitchVectorCallback
      // );

      scriptNode = await createCrepeWorkletNode(
        audioContext,
        pitchCallback,
        pitchVectorCallback
      );

      // Connect to source node and prepare gain node
      gain = audioContext.createGain();
      gain.gain.setValueAtTime(0, audioContext.currentTime);

      sourceNode.connect(scriptNode);
      scriptNode.connect(gain);
      gain.connect(audioContext.destination);

      console.log('Preloading completed.');
      this.preloaded = true;

      return true;
    },

    start: async function (recordMode = false) {
      if (!this.preloaded) {
        console.error(
          'Error: audioStreamer not preloaded. Call preload() first.'
        );
        return;
      }

      console.log('Starting pitch tracking...');
      resumeAudioContext(); // Ensure the audio context is active

      if (this.meydaAnalyzer) {
        this.meydaAnalyzer.start();
        console.log('MeydaAnalyzer started.');
      }

      if (recordMode) {
        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };
        mediaRecorder.start();
        console.log('Recording started.');
      }

      console.log('Pitch tracking started.');
    },

    close: function () {
      if (this.meydaAnalyzer) this.meydaAnalyzer.stop();

      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        console.log('Stopping mediaRecorder with state:', mediaRecorder.state);
        mediaRecorder.stop();
      }

      this.dismantleAudioNodes();
      suspendAudioContext();
    },

    close_not_save: function () {
      //mediaRecorder.stop();
      // audioContext.suspend();
      if (this.meydaAnalyzer) this.meydaAnalyzer.stop();
      // this.dismantleAudioNodes();
      suspendAudioContext();
    },
    close_maybe_save: function () {
      if (this.meydaAnalyzer) this.meydaAnalyzer.stop();
      mediaRecorder.stop();
      // audioStreamer.dismantleAudioNodes();
      //audioContext.suspend();
    },
    save_or_not: async function (answer) {
      if (this.meydaAnalyzer) this.meydaAnalyzer.stop();
      if (answer === 'save') {
        //This creates an audioBlob
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
        // Transform audioBlob to audioArray
        try {
          // Convert Blob to ArrayBuffer using await
          const arrayBuffer = await audioBlob.arrayBuffer();
          // // Clean
          // audioChunks = [];
          // this.dismantleAudioNodes();
          // suspendAudioContext();
          return arrayBuffer;
        } catch (error) {
          console.error('Error converting Blob to ArrayBuffer:', error);
          // Clean
          // audioChunks = [];
          // //audioContext.suspend();
          // suspendAudioContext();
          return 0;
        }
      }

      // audioChunks = [];
      // audioContext.suspend();
      // suspendAudioContext();
    },
  };

  return audioStreamer;
};

export { makeAudioStreamer };
