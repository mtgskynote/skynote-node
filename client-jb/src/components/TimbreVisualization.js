import React, {useRef } from "react";
import PieChart from "./pieChart";
import { makeAudioStreamer } from "./audioStreamer.js";
import Queue from "../utils/QueueWithMaxLength"
import PitchTuner from "./pitchTuner";

// Labes for pieChart starting at [0,1] and going around clockwise
const labels = [
  "pitch",
  "Dynamic Stability",  // based on rms
  "spectralCentroid",
  "spectralFlux"
];

const freq2midipitch = (freq) => {
  return(12 * (Math.log2(freq / 440)) + 69)
}

const TimbreVisualization = () => {
  console.log(`STARTING Timbre Visualization, about to create audio streamer.`)
  const pieChartRef = useRef(null);
  const pitchTunerRef = useRef(null)


  //---- Send array of values to pieChart for drawing segments
  function setSegments(sarray){
    //console.log(`spectralFlux : ${sarray[3]}`)
    //console.log(`rms mean : ${featureValues.rms.computeMean()}`)
    if (pieChartRef.current) {
      pieChartRef.current.updateData(sarray);
    }
  }

  //---- keep track of the history of features we extract
  const featureValues = {
    // queue length (form computing means and SDs), normlow, normhi, sdnormlow, sdnormhi
    pitch : new Queue(5, 24, 61, 0, .5),  //[110Hz, 440Hz] = [A2, A4] = midinote[24,69]
    rms: new Queue(5, 0, .25, 0, .01),
    spectralCentroid: new Queue(5, 0, 500),
    spectralFlux : new Queue(5, 3, 1, 0, .1) 
  }
  
  //---- Pass to makeAudioStreamer to get callbacks with argument object pc={pitch (in Hz), confidence(in [0,1])}
  const pitchCallback=function(pc) {
    if (pc.confidence > .6){
      featureValues.pitch.push(freq2midipitch(pc.pitch));
    }
    else {
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
    setSegments([featureValues.pitch.computeSD(), featureValues.rms.computeSD(), featureValues.spectralCentroid.computeMean(), featureValues.spectralFlux.computeSD() ]);
  }
  
  //---- Pass to makeAudioStreamer to get callbaks with object features (with attributes being Meyda features)
  const aCb=function(features){
    featureValues.rms.push(features.rms);
    featureValues.spectralCentroid.push(features.spectralCentroid);
    featureValues.spectralFlux.push(features.spectralFlux);

    //setSegments([normalize(featureValues.pitch.last(), 100, 360), normalize(featureValues.rms.computeMean(),0, .1), normalize(featureValues.spectralCentroid.computeMean(),0,600), normalize(featureValues.spectralFlux.computeMean(),1,4)  ]);
    //setSegments([normalize(featureValues.pitch.last(), 100, 360), normalize(featureValues.rms.computeSD(),.003, .0010), normalize(featureValues.spectralCentroid.computeMean(),0,600), normalize(featureValues.spectralFlux.computeMean(),1,4)  ]);
    //setSegments([featureValues.pitch.last(), featureValues.rms.computeMean(), featureValues.spectralCentroid.computeMean(), featureValues.spectralFlux.computeMean() ]);
    setSegments([featureValues.pitch.computeSD(), featureValues.rms.computeSD(), featureValues.spectralCentroid.computeMean(), featureValues.spectralFlux.computeSD() ]);
  };

  // Start the streaming audio and request your callbacks
  const audioStreamer = makeAudioStreamer(pitchCallback, null, aCb);
  audioStreamer.init(["rms", "spectralCentroid", "spectralFlux"]);  //LIST ONLY MEYDA FEATURES  !!!!!
    

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        
        <PieChart
          ref={pieChartRef}
          id="piechart"
          m_width={440}
          m_height={440}
          radius={180}
//          segments={segments}
          labels={labels}
        />
        </div>

        <div
        style={{
          textAlign: "center",
        }}
      >
        <h2> Pitch </h2>
        <PitchTuner ref={pitchTunerRef} m_width={60} m_height={60}/>
      </div>
      {/* <div>{controlbar}</div>   */}

    </div>
  );
};
export default TimbreVisualization;
