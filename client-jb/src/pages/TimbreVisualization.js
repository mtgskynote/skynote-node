import React, { useRef, useEffect } from 'react';
import PieChart from '../components/timbre-visualization/PieChart.js';
import { makeAudioStreamer } from '../utils/pitch-tracking/audioStreamer.js';
import Queue from '../utils/QueueWithMaxLength.js';
import PitchTuner from '../components/timbre-visualization/PitchTuner.js';

// Labes for pieChart starting at [0,1] and going around clockwise
const labels = [
  'Pitch',
  'Dynamic Stability', // based on rms
  'Spectral Centroid',
  'Spectral Flux',
];

const freq2midipitch = (freq) => {
  return 12 * Math.log2(freq / 440) + 69;
};

const TimbreVisualization = () => {
  const pieChartRef = useRef(null);
  const pitchTunerRef = useRef(null);
  const audioStreamer = useRef(null);

  //---- Send array of values to pieChart for drawing segments
  function setSegments(sarray) {
    if (pieChartRef.current) {
      pieChartRef.current.updateData(sarray);
    }
  }

  //---- keep track of the history of features we extract
  const featureValues = {
    // queue length (form computing means and SDs), normlow, normhi, sdnormlow, sdnormhi
    pitch: new Queue(5, 24, 61, 0, 0.5), //[110Hz, 440Hz] = [A2, A4] = midinote[24,69]
    rms: new Queue(5, 0, 0.25, 0, 0.01),
    spectralCentroid: new Queue(5, 0, 500),
    spectralFlux: new Queue(5, 3, 1, 0, 0.1),
  };

  //---- Pass to makeAudioStreamer to get callbacks with argument object pc={pitch (in Hz), confidence(in [0,1])}
  const pitchCallback = function (pc) {
    if (pc.confidence > 0.6) {
      featureValues.pitch.push(freq2midipitch(pc.pitch));
    } else {
      //console.log(`    No  confidence: value = ${pc.pitch},  confidence=${pc.confidence}`)
      //pitchvaluetext.innerHTML = "Not voiced"
      featureValues.pitch.push(0);
    }
    if (pitchTunerRef.current) {
      pitchTunerRef.current.setPitch(pc.pitch, pc.confidence);
    }
    //setSegments([normalize(featureValues.pitch.last(), 100, 360), normalize(featureValues.rms.computeMean(),0,.1), normalize(featureValues.spectralCentroid.computeMean(),0,600), normalize(featureValues.spectralFlux.computeMean(),1,4)  ]);
    //setSegments([normalize(featureValues.pitch.last(), 100, 360), normalize(featureValues.rms.computeSD(),.003, .001), normalize(featureValues.spectralCentroid.computeMean(),0,600), normalize(featureValues.spectralFlux.computeMean(),1,4)  ]);
    //setSegments([featureValues.pitch.last(), featureValues.rms.computeMean(), featureValues.spectralCentroid.computeMean(), featureValues.spectralFlux.computeMean() ]);
    setSegments([
      featureValues.pitch.computeSD(),
      featureValues.rms.computeSD(),
      featureValues.spectralCentroid.computeMean(),
      featureValues.spectralFlux.computeSD(),
    ]);
  };

  //setSegments([normalize(featureValues.pitch.last(), 100, 360), normalize(featureValues.rms.computeMean(),0,.1), normalize(featureValues.spectralCentroid.computeMean(),0,600), normalize(featureValues.spectralFlux.computeMean(),1,4)  ]);
  //setSegments([normalize(featureValues.pitch.last(), 100, 360), normalize(featureValues.rms.computeSD(),.003, .001), normalize(featureValues.spectralCentroid.computeMean(),0,600), normalize(featureValues.spectralFlux.computeMean(),1,4)  ]);
  //setSegments([featureValues.pitch.last(), featureValues.rms.computeMean(), featureValues.spectralCentroid.computeMean(), featureValues.spectralFlux.computeMean() ]);
  setSegments([
    featureValues.pitch.computeSD(),
    featureValues.rms.computeSD(),
    featureValues.spectralCentroid.computeMean(),
    featureValues.spectralFlux.computeSD(),
  ]);

  //---- Pass to makeAudioStreamer to get callbaks with object features (with attributes being Meyda features)
  const aCb = function (features) {
    //console.log(`pushing rms on to Queue : ${features.rms}`)
    featureValues.rms.push(features.rms);
    featureValues.spectralCentroid.push(features.spectralCentroid);
    featureValues.spectralFlux.push(features.spectralFlux);

    //setSegments([normalize(featureValues.pitch.last(), 100, 360), normalize(featureValues.rms.computeMean(),0, .1), normalize(featureValues.spectralCentroid.computeMean(),0,600), normalize(featureValues.spectralFlux.computeMean(),1,4)  ]);
    //setSegments([normalize(featureValues.pitch.last(), 100, 360), normalize(featureValues.rms.computeSD(),.003, .0010), normalize(featureValues.spectralCentroid.computeMean(),0,600), normalize(featureValues.spectralFlux.computeMean(),1,4)  ]);
    //setSegments([featureValues.pitch.last(), featureValues.rms.computeMean(), featureValues.spectralCentroid.computeMean(), featureValues.spectralFlux.computeMean() ]);
    setSegments([
      featureValues.pitch.computeSD(),
      featureValues.rms.computeSD(),
      featureValues.spectralCentroid.computeMean(),
      featureValues.spectralFlux.computeSD(),
    ]);
  };

  useEffect(() => {
    const initializeAudioStreamer = async () => {
      if (!audioStreamer.current) {
        console.log('Making new audio stream');
        audioStreamer.current = makeAudioStreamer(pitchCallback, null, aCb);
        await audioStreamer.current.preload([
          'rms',
          'spectralCentroid',
          'spectralFlux',
        ]);
        await audioStreamer.current.start();
      }
    };

    initializeAudioStreamer();

    return () => {
      console.log('CLOSING');
      if (audioStreamer.current) {
        audioStreamer.current.close();
        audioStreamer.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        textAlign: 'center',
        margin: 'auto',
      }}
      className="pt-8"
    >
      <h2> Sound Quality </h2>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PieChart
          ref={pieChartRef}
          id="piechart"
          m_width={445}
          m_height={445}
          radius={180}
          labels={labels}
          //segments={segments}
        />
      </div>

      <div className="w-full">
        <h2 className="mb-0"> Pitch </h2>
        <PitchTuner ref={pitchTunerRef} />
      </div>
    </div>
  );
};
export default TimbreVisualization;
