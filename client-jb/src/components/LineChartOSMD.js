import React, {useState, useEffect, useRef} from "react";

//Pitch track line component
const LineChart = (props) => {
  const containerRef = useRef(null);
  const [polylinePoints, setPolylinePoints] = useState([]);

  useEffect(()=> {
    const containerElement = containerRef.current;
    const rect = containerElement.getBoundingClientRect();
    const newPolylinePoints = props.pitchDataPosX.map((value, index) => {
      const x = props.pitchDataPosX[index] + props.pitchIndex[index] - rect.left;
      const y =  props.pitchDataPosY[index] - rect.top; 
      return [x, y]; // Return a coordinate pair as an array [x, y]
    });
    setPolylinePoints(newPolylinePoints);
  
  }, [props.pitchData, props.zoom]); //, previousPitchData

  return (
    <div ref={containerRef}>
      <svg width={props.width} height={props.height}>
        {polylinePoints.map(([x, y], index) => (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={2}
            fill="black" //props.pitchColor
            
          />
        ))}
      </svg>
    </div>
  );
};

export default LineChart;