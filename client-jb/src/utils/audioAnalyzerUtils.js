import Meyda from 'meyda';
import Pitchfinder from 'pitchfinder';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const extractFeatures = async (audioBuffer) => {
  return new Promise((resolve, reject) => {
    const frameSize = 2048;
    const hopSize = 512;

    const mfccValues = [];
    const rmsValues = [];
    const f0Values = [];

    const detectPitch = Pitchfinder.YIN({ sampleRate: audioBuffer.sampleRate });

    const totalSamples = audioBuffer.length;

    // Ensure totalSamples is greater than frameSize
    if (totalSamples < frameSize) {
      reject(new Error('Audio buffer is smaller than frame size.'));
      return;
    }

    // Calculate total frames we can process
    const totalFrames = Math.floor((totalSamples - frameSize) / hopSize) + 1;

    console.log(`Total Samples: ${totalSamples}`);
    console.log(`Frame Size: ${frameSize}, Hop Size: ${hopSize}`);
    console.log(`Total Frames: ${totalFrames}`);

    // Process each frame
    for (let currentFrame = 0; currentFrame < totalFrames; currentFrame++) {
      const startSample = currentFrame * hopSize;
      const endSample = startSample + frameSize;

      // Get the frame data
      const frameData = audioBuffer
        .getChannelData(0)
        .slice(startSample, endSample);

      if (frameData.length !== frameSize) {
        console.warn(
          `Frame ${currentFrame} has incorrect data length: ${frameData.length}`
        );
        continue;
      }

      // Extract features using Meyda
      const features = Meyda.extract(['mfcc', 'rms'], frameData);

      if (features) {
        mfccValues.push(features.mfcc);
        rmsValues.push(features.rms);
      }

      // Extract pitch using Pitchfinder (YIN algorithm)
      const pitch = detectPitch(frameData);
      f0Values.push(pitch || null);
    }

    // Resolve with the collected features
    resolve({
      mfcc: mfccValues,
      rms: rmsValues,
      pitches: f0Values,
      sampleRate: audioBuffer.sampleRate,
      hopLength: hopSize,
    });
  });
};

const detectVariableSections = (mfccs, rms, pitches, sampleRate, hopLength) => {
  // Calculates mean of an array
  const mean = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length;

  // Calculates standard deviation of an array
  const standardDeviation = (values) => {
    const avg = mean(values);
    const variance =
      values.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  };

  // Converts frequency in Hz to the closest MIDI note number
  const hzToMidi = (hz) => {
    if (hz <= 0) return 0; // to handle invalid frequencies
    return 69 + 12 * Math.log2(hz / 440);
  };

  // Converts MIDI note number to frequency in Hz
  const midiToHz = (midi) => {
    return 440 * Math.pow(2, (midi - 69) / 12);
  };

  const windowSize = 100; // 100 frames per window
  const hopSize = 25; // 25 frames hop between windows

  // Transpose the MFCCs array from [frames, mfccs] to [mfccs, frames]
  const numFrames = mfccs.length; // 2135
  const numMfccs = mfccs[0].length; // 13
  const transposedMfccs = Array.from({ length: numMfccs }, (_, i) =>
    mfccs.map((frame) => frame[i])
  );

  // Calculate variability in timbre (MFCCs) using a sliding window
  let timbreVariability = [];
  for (let start = 0; start <= numFrames - windowSize; start += hopSize) {
    const windowMfccs = transposedMfccs.map((row) =>
      row.slice(start, start + windowSize)
    );
    // Calculate standard deviation for each MFCC
    const windowStd = windowMfccs.map((mfcc) => standardDeviation(mfcc));
    const avgStd = mean(windowStd);
    timbreVariability.push(avgStd);
  }
  const maxTimbreIdx = timbreVariability.indexOf(
    Math.max(...timbreVariability)
  );

  // Calculate variability in loudness (RMS) using a sliding window
  let loudnessVariability = [];
  for (let start = 0; start <= numFrames - windowSize; start += hopSize) {
    const windowRms = rms.slice(start, start + windowSize);
    const windowStd = standardDeviation(windowRms);
    loudnessVariability.push(windowStd);
  }
  const maxLoudnessIdx = loudnessVariability.indexOf(
    Math.max(...loudnessVariability)
  );

  // Calculate pitch differences from piano notes using a sliding window
  let pitchDiffVariability = [];
  for (let start = 0; start <= pitches.length - windowSize; start += hopSize) {
    const windowPitches = pitches.slice(start, start + windowSize);
    const windowPitchDiffs = windowPitches.map((pitch) => {
      const midiNote = hzToMidi(pitch);
      const nearestNoteHz = midiToHz(Math.round(midiNote));
      return Math.abs(pitch - nearestNoteHz);
    });
    const avgPitchDiff =
      windowPitchDiffs.reduce((sum, val) => sum + val, 0) /
      windowPitchDiffs.length;
    pitchDiffVariability.push(avgPitchDiff);
  }
  const maxPitchDiffIdx = pitchDiffVariability.indexOf(
    Math.max(...pitchDiffVariability)
  );

  // Calculate sample indices for significant sections (2.32-second segments)
  const segmentLength = Math.floor(2.32 * sampleRate);
  const timbreSection =
    Math.floor((maxTimbreIdx * hopSize * hopLength) / segmentLength) *
    segmentLength;
  const loudnessSection =
    Math.floor((maxLoudnessIdx * hopSize * hopLength) / segmentLength) *
    segmentLength;
  const pitchDiffSection =
    Math.floor((maxPitchDiffIdx * hopSize * hopLength) / segmentLength) *
    segmentLength;

  return [
    [timbreSection, timbreSection + segmentLength],
    [loudnessSection, loudnessSection + segmentLength],
    [pitchDiffSection, pitchDiffSection + segmentLength],
  ];
};

export default {
  extractFeatures,
  detectVariableSections,
};
