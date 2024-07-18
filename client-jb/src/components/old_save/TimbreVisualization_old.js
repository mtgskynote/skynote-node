import React, { useEffect, useState } from 'react'
import PieChart from './pieChart'
//import { useControlBar } from "./controlbar";
import { makeAudioStreamer } from './audioStreamer.js'
import Queue from '../utils/QueueWithMaxLength'

// const randInt = function (min, max) {
//   return Math.floor(min + (max + 1 - min) * Math.random())
// }

const TimbreVisualization = () => {
  console.log(`STARTING Timbre Visualization, about to create audio streamer.`)
  //const params = useParams();
  //console.log(`${folderBasePath}/${params.file}`);

  // The array argument length determines the number of segments of the PieChart
  //     and elements are used to initialized the radii of the segments
  const [segments, setSegments] = useState([
    0.25 + 0.5 * Math.random(),
    0.25 + 0.5 * Math.random(),
    0.25 + 0.5 * Math.random(),
    0.25 + 0.5 * Math.random(),
  ])

  // keep track of the history of features we extract
  const featureValues = {
    pitch: new Queue(10),
    rms: new Queue(10),
    energy: new Queue(10),
    spectralCentroid: new Queue(10),
  }

  const pitchCallback = function (pc) {
    console.log(`Got pitch: value = ${pc.pitch},  confidence=${pc.confidence}`)
    if (pc.confidence > 0.5) {
      console.log(`pitch is ${pc.pitch}`)
      featureValues.pitch.push(normalizeFrequency(pc.pitch) * 100)
      setSegments([
        featureValues.pitch.peek(),
        10 * featureValues.rms.peek(),
        featureValues.energy.peek(),
        featureValues.spectralCentroid.peek() / 100,
      ])
    } else {
      console.log(
        `    No  confidence: value = ${pc.pitch},  confidence=${pc.confidence}`
      )
      //pitchvaluetext.innerHTML = "Not voiced"
    }
    //confidencetext.innerHTML = pc.confidence;
  }

  const audioStreamer = makeAudioStreamer(pitchCallback)
  // PieChart wedge labels (should be of same lengthas useState arg )
  const labels = ['pitch', 'rms', 'energy', 'spectralCentroid']

  //const controlbar = useControlBar();

  function normalizeFrequency(frequency) {
    const minFrequency = 20
    const maxFrequency = 20000
    return (frequency - minFrequency) / (maxFrequency - minFrequency)
  }

  useEffect(() => {
    // let playbutton = document.getElementById("play");
    // console.log(`playbutton is ${playbutton}`);

    // playbutton.addEventListener("click", function () {
    //   audioStreamer.init();
    // });

    console.log(`in useEffect(), initing audioStreamier`)
    audioStreamer.init(['rms', 'energy', 'spectralCentroid']) //LIST ONLY MEYDA FEATURES  !!!!!
    //# audioStreamer.init(["rms",  "energy", "spectralCentroid"]);

    audioStreamer.setAnalyzerCallback(function (features) {
      //console.log(`features.rms : ${features.rms}`)
      //console.log(`features.mfcc : ${features.mfcc}`)
      //console.log(`features.energy : ${features.energy}`)
      //console.log(`features.spectralCentroid : ${features.spectralCentroid}`)

      featureValues.rms.push(features.rms)
      featureValues.spectralCentroid.push(features.spectralCentroid)
      featureValues.energy.push(features.energy)
      //#  setSegments([0, 3*featureValues.rms.peek(), featureValues.energy.peek(), featureValues.spectralCentroid.peek()/100 ]);
      //setSegments([3*featureValues.rms.peek(), featureValues.energy.peek(), featureValues.spectralCentroid.peek()/100 ]);
      setSegments([
        featureValues.pitch.peek(),
        10 * featureValues.rms.peek(),
        featureValues.energy.peek(),
        featureValues.spectralCentroid.peek() / 100,
      ])
    })

    // Clean up interval on component unmount
    return () => {
      //clearInterval(intervalId1);
      audioStreamer.setAnalyzerCallback(null)
    }
  }, []) // Empty dependency array to run effect only once on component mount

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
          m_width={440}
          m_height={440}
          radius={180}
          segments={segments}
          labels={labels}
        />
      </div>
      {/* <div>{controlbar}</div>   */}
    </div>
  )
}
export default TimbreVisualization
