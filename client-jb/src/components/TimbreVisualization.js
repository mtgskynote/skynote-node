import React, {useRef } from "react";
import PieChart from "./pieChart";
import { makeAudioStreamer } from "./audioStreamer.js";
import Queue from "../utils/QueueWithMaxLength"

// Labes for pieChart starting at [0,1] and going around clockwise
const labels = [
  "pitch",
  "rms",
  "spectralCentroid",
  "spectralFlux"
];


const TimbreVisualization = () => {
  console.log(`STARTING Timbre Visualization, about to create audio streamer.`)
  const pieChartRef = useRef(null);

  //---- normalize [minx, maxx] to [0,1], return scaled x
  function normalize(x, minx, maxx ) {  // just used for drawing on display
  //range expected from instrument (high violin string is tunded to 659 Hz)
    return Math.min(1,Math.max(0,(x - minx) / (maxx - minx)))
  }

  //---- Send array of values to pieChart for drawing segments
  function setSegments(sarray){
    console.log(`spectralFlux : ${sarray[3]}`)
    if (pieChartRef.current) {
      pieChartRef.current.updateData(sarray);
    }
  }

  //---- keep track of the history of features we extract
  const featureValues = {
    pitch : new Queue(10),
    rms: new Queue(10),
    spectralCentroid: new Queue(10),
    spectralFlux : new Queue(10)
  }
  
  //---- Pass to makeAudioStreamer to get callbacks with argument object pc={pitch (in Hz), confidence(in [0,1])}
  const pitchCallback=function(pc) {
    if (pc.confidence > .6){
      featureValues.pitch.push(pc.pitch);
    }
    else {
      //console.log(`    No  confidence: value = ${pc.pitch},  confidence=${pc.confidence}`)
      //pitchvaluetext.innerHTML = "Not voiced"
      featureValues.pitch.push(0);
    }
    setSegments([normalize(featureValues.pitch.last(), 100, 360), normalize(featureValues.rms.computeMean(),0,.1), normalize(featureValues.spectralCentroid.computeMean(),0,600), normalize(featureValues.spectralFlux.computeMean(),1,4)  ]);
  }
  
  //---- Pass to makeAudioStreamer to get callbaks with object features (with attributes being Meyda features)
  const aCb=function(features){
    featureValues.rms.push(features.rms);
    featureValues.spectralCentroid.push(features.spectralCentroid);
    featureValues.spectralFlux.push(features.spectralFlux);

    setSegments([normalize(featureValues.pitch.last(), 100, 360), normalize(featureValues.rms.computeMean(),0, .1), normalize(featureValues.spectralCentroid.computeMean(),0,600), normalize(featureValues.spectralFlux.computeMean(),1,4)  ]);
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
      {/* <div>{controlbar}</div>   */}
    </div>
  );
};
export default TimbreVisualization;
