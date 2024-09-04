import React from 'react';
import PieChart from './pieChart';
import { makeAudioStreamer } from '../utils/audioStreamer.js';
import Queue from '../utils/QueueWithMaxLength';

const labels = ['pitch', 'rms', 'energy', 'spectralCentroid'];

var segments = [0.1, 0.3, 0.6, 0.9];

const TimbreVisualization = () => {
  console.log(`STARTING Timbre Visualization, about to create audio streamer.`);

  function normalizeFrequency(frequency) {
    const minFrequency = 20;
    const maxFrequency = 20000;
    return (frequency - minFrequency) / (maxFrequency - minFrequency);
  }

  function setSegments(sarray) {
    console.log(`set segments`);
    segments = sarray;
    console.log(`piechart: ${document.getElementById('piechart')}`);
  }

  // keep track of the history of features we extract
  const featureValues = {
    pitch: new Queue(10),
    rms: new Queue(10),
    energy: new Queue(10),
    spectralCentroid: new Queue(10),
  };

  const pitchCallback = function (pc) {
    console.log(`Got pitch: value = ${pc.pitch},  confidence=${pc.confidence}`);
    if (pc.confidence > 0.5) {
      console.log(`pitch is ${pc.pitch}`);
      featureValues.pitch.push(normalizeFrequency(pc.pitch) * 100);
      setSegments([
        featureValues.pitch.peek(),
        10 * featureValues.rms.peek(),
        featureValues.energy.peek(),
        featureValues.spectralCentroid.peek() / 100,
      ]);
    } else {
      console.log(
        `    No  confidence: value = ${pc.pitch},  confidence=${pc.confidence}`
      );
      //pitchvaluetext.innerHTML = "Not voiced"
    }
    //confidencetext.innerHTML = pc.confidence;
  };

  const audioStreamer = makeAudioStreamer(pitchCallback);
  audioStreamer.init(['rms', 'energy', 'spectralCentroid']); //LIST ONLY MEYDA FEATURES  !!!!!
  audioStreamer.setAnalyzerCallback(function (features) {
    featureValues.rms.push(features.rms);
    featureValues.spectralCentroid.push(features.spectralCentroid);
    featureValues.energy.push(features.energy);
    //#  setSegments([0, 3*featureValues.rms.peek(), featureValues.energy.peek(), featureValues.spectralCentroid.peek()/100 ]);
    //setSegments([3*featureValues.rms.peek(), featureValues.energy.peek(), featureValues.spectralCentroid.peek()/100 ]);
    setSegments([
      featureValues.pitch.peek(),
      10 * featureValues.rms.peek(),
      featureValues.energy.peek(),
      featureValues.spectralCentroid.peek() / 100,
    ]);
  });

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PieChart
          id="piechart"
          m_width={440}
          m_height={440}
          radius={180}
          segments={segments}
          labels={labels}
        />
      </div>
      {/* <div>{controlbar}</div>   */}
    </div>
  );
};
export default TimbreVisualization;
