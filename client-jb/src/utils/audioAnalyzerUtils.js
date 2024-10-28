import Meyda from 'meyda';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const extractFeatures = async (audioBuffer) => {
  return new Promise((resolve, reject) => {
    const frameSize = 2048; // Ensure this is a power of 2
    const hopSize = 512; // This should also be a power of 2

    const mfccValues = [];
    const rmsValues = [];

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

      // Check if frameData has the correct length
      console.log(
        `Processing Frame ${currentFrame}: startSample=${startSample}, endSample=${endSample}, frameData.length=${frameData.length}`
      );

      if (frameData.length !== frameSize) {
        console.warn(
          `Frame ${currentFrame} has incorrect data length: ${frameData.length}`
        );
        continue; // Skip this frame
      }

      // Extract features using Meyda
      const features = Meyda.extract(['mfcc', 'rms'], {
        inputBuffer: frameData,
        bufferSize: frameSize, // Use the same bufferSize
      });

      if (features) {
        mfccValues.push(features.mfcc);
        rmsValues.push(features.rms);
      } else {
        console.warn(`No features extracted for frame ${currentFrame}`);
      }
    }

    // Resolve with the collected features
    resolve({ mfcc: mfccValues, rms: rmsValues });
  });
};

const detectVariableSections = (features, windowSize = 100, hopSize = 25) => {
  const { mfccs, rms, pitches, sampleRate, hopSize: frameHopSize } = features;

  function calculateVariability(data, length, overlap) {
    const variability = [];
    for (let i = 0; i < data.length - length; i += overlap) {
      const window = data.slice(i, i + length);
      const stdDev =
        window.reduce(
          (sum, x) =>
            sum +
            Math.pow(x - window.reduce((a, b) => a + b) / window.length, 2),
          0
        ) / window.length;
      variability.push(Math.sqrt(stdDev));
    }
    return variability;
  }

  const timbreVariability = calculateVariability(mfccs, windowSize, hopSize);
  const loudnessVariability = calculateVariability(rms, windowSize, hopSize);
  const pitchVariability = calculateVariability(pitches, windowSize, hopSize);

  const maxTimbreIdx = timbreVariability.indexOf(
    Math.max(...timbreVariability)
  );
  const maxLoudnessIdx = loudnessVariability.indexOf(
    Math.max(...loudnessVariability)
  );
  const maxPitchIdx = pitchVariability.indexOf(Math.max(...pitchVariability));

  const segmentDuration =
    Math.floor((2.32 * sampleRate) / frameHopSize) * frameHopSize;

  return [
    {
      start: maxTimbreIdx * frameHopSize,
      end: maxTimbreIdx * frameHopSize + segmentDuration,
      label: 'Timbre',
    },
    {
      start: maxLoudnessIdx * frameHopSize,
      end: maxLoudnessIdx * frameHopSize + segmentDuration,
      label: 'Loudness',
    },
    {
      start: maxPitchIdx * frameHopSize,
      end: maxPitchIdx * frameHopSize + segmentDuration,
      label: 'Pitch Difference',
    },
  ];
};

const plotAudioWithHighlights = (
  audioBuffer,
  highlightedSections,
  containerId
) => {
  const data = audioBuffer.getChannelData(0); // Using the first channel
  const sampleRate = audioBuffer.sampleRate;

  // Generate x-axis labels as time in seconds
  const timeLabels = Array.from(
    { length: data.length },
    (_, i) => i / sampleRate
  );

  const ctx = document.getElementById(containerId).getContext('2d');
  const backgroundColors = Array(data.length).fill('rgba(173, 216, 230, 0.5)');

  // Apply colors for highlighted sections
  highlightedSections.forEach((section, index) => {
    const color = [
      'rgba(255, 0, 0, 0.3)',
      'rgba(0, 255, 0, 0.3)',
      'rgba(255, 165, 0, 0.3)',
    ][index];
    for (let i = section.start; i < section.end; i++) {
      backgroundColors[i] = color;
    }
  });

  // Plot with Chart.js
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [
        {
          label: 'Audio Waveform',
          data,
          backgroundColor: backgroundColors,
          borderColor: 'rgba(0, 123, 255, 0.8)',
          borderWidth: 1,
          fill: true,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { type: 'linear', title: { display: true, text: 'Time (s)' } },
        y: { title: { display: true, text: 'Amplitude' } },
      },
    },
  });
};

export default {
  extractFeatures,
  detectVariableSections,
  plotAudioWithHighlights,
};
