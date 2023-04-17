import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PieChart from "./pieChart";
import { useControlBar } from "./controlbar";
import { makeAudioStreamer, getPitch } from "./audioStreamer.js";

const randInt = function (min, max) {
  return Math.floor(min + (max + 1 - min) * Math.random());
};

const TimbreVisualization = () => {
  //let ref = useRef(0);
  //const params = useParams();
  //console.log(`${folderBasePath}/${params.file}`);

  const [segments, setSegments] = useState([
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
  ]);

  //console.log(`initializing a new timbre visualization!!!!!!!!!`);
  const audioStreamer = makeAudioStreamer();
  const labels = [
    "sweetness",
    "warmth",
    "vibrato",
    "tremelo",
    "stringency",
    "loudness",
    "roughness",
  ];

  const controlbar = useControlBar();

  function normalizeFrequency(frequency) {
    const minFrequency = 20;
    const maxFrequency = 20000;
    return (frequency - minFrequency) / (maxFrequency - minFrequency);
  }

  useEffect(() => {
    let playbutton = document.getElementById("play");
    console.log(`playbutton is ${playbutton}`);

    playbutton.addEventListener("click", function () {
      audioStreamer.init();
    });

    const intervalId1 = setInterval(async () => {
      let a = audioStreamer.getAmplitude();
      try {
        let pitch = await audioStreamer.getPitch();
        let normalizedPitch = normalizeFrequency(pitch) * 100;
        //console.log(`pitch=${pitch}, normalizedPitch=${normalizedPitch}`);
        setSegments([0.5, 0.5, 0.5, normalizedPitch, 0.5, a]);
      } catch (error) {
        //console.log("Error getting pitch:", error);
      }
    }, 100);

    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId1);
    };
  }, []); // Empty dependency array to run effect only once on component mount

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
          m_width={440}
          m_height={440}
          radius={180}
          segments={segments}
          labels={labels}
        />
      </div>
      <div>{controlbar}</div>
    </div>
  );
};
export default TimbreVisualization;
