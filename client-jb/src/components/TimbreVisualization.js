import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PieChart from "../purecomponents/pieChart";
import { useControlBar } from "../purecomponents/controlbar";
import {makeAudioStreamer} from '../purecomponents/audioStreamer.js';

const randInt = function (min, max) {
  return Math.floor(min + (max + 1 - min) * Math.random());
};


const TimbreVisualization = () => {
  //let ref = useRef(0);
  //const params = useParams();
  //console.log(`${folderBasePath}/${params.file}`);

  const [segments, setSegments] = useState([Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]);

  console.log(`initializing a new timbre visualization!!!!!!!!!`)
  const audioStreamer=makeAudioStreamer();
  const labels=["sweetness", "warmth", "vibrato", "tremelo", "stringency", "loudness", "roughness"]


  const controlbar = useControlBar();

  useEffect(() => {

    let playbutton=document.getElementById("play")
    console.log(`playbutton is ${playbutton}`)
     
    playbutton.addEventListener('click', function(){
       audioStreamer.init();
    });
  
    const intervalId1 = setInterval(() => {
      let a = audioStreamer.getAmplitude();
      console.log(`a=${a}`)
      setSegments([.5, .5, .5, .5, .5, a])
      //setSegments([Math.random(), Math.random(), Math.random(), Math.random(), Math.random()])
    },100 );
    
    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId1);
    };

  }, []); // Empty dependency array to run effect only once on component mount



  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PieChart m_width={440} m_height={440} radius={180} segments={segments} labels={labels} />
      </div>
      <div>{controlbar}</div>
    </div>
  );

};
export default TimbreVisualization;
