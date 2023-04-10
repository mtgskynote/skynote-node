// import React, { useEffect } from "react";
//import { useParams } from "react-router-dom";
import { useControlBar } from "../purecomponents/controlbar";
// import { PieViz } from "../purecomponents/pieViz4";

//import { useRef } from 'react';

// const randInt = function (min, max) {
//   return Math.floor(min + (max + 1 - min) * Math.random());
// };

// const labels = [
//   "sweetness",
//   "warmth",
//   "vibrato",
//   "tremelo",
//   "stringency",
//   "loudness",
//   "roughness",
// ];

const TimbreVisualization = () => {
  //let ref = useRef(0);
  //const params = useParams();
  //console.log(`${folderBasePath}/${params.file}`);

  //this.pieVizRef = React.createRef();

  // const labels = [
  //   "sweetness",
  //   "warmth",
  //   "vibrato",
  //   "tremelo",
  //   "stringency",
  //   "loudness",
  //   "roughness",
  // ];

  // var m_width = 400;
  // var m_height = 400;

  // const svgelmt = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // svgelmt.setAttributeNS(null, "width", m_width)
  // svgelmt.setAttributeNS(null, "height", m_height)
  // svgelmt.style.display = "table";
  // svgelmt.style.margin = "auto" //centers

  // document.body.appendChild(svgelmt)

  //const pieViz = usePieViz();
  //var temp = pieViz.init(labels, 200, m_width, m_height, svgelmt);
  //const  foo= useRef(pieViz)

  const controlbar = useControlBar();
  //console.log(`pieViz is ${pieViz}` )
  return (
    <>
      <div>{controlbar}</div>
    </>
  );
  //ref.current=PieViz
  // ​
  //   setInterval(function(){
  //     //let a = audioStreamer.getAmplitude();
  //     //pieViz.set_wedge_radius(0, a)}, 1000 );

  //     PieViz.set_wedge_radius(randInt(0, labels.length-1), Math.random())} , 50 );
  // ​
  //     if (this.pieVizRef.current) {
  //       this.pieVizRef.current.set_wedge_radius(0, Math.random()); // Update the radius of the first wedge to 50
  //     }
  // ​
  // ​
  //   //return(<> <PieViz labels={labels} width="400" height="400" radius="200"   />  <div> {controlbar}</div>    </>)
  //   return(<> <PieViz labels={labels} m_width="400" m_height="400" pie_radius="200"   />  <div> {controlbar}</div>    </>)
  // ​
};

export default TimbreVisualization;
