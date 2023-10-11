import React, {useState, useEffect, useRef} from "react";

//Convert frequency Hertz to MIDI function
const freq2midipitch = (freq) => {
  return(12 * (Math.log2(freq / 440)) + 69)
}
//let staffBox;
//let container;

//Pitch track line component
const LineChart = (props) => {
  
  //if (!pitchData || pitchData.length === 0) return null;
  const containerRef = useRef(null);

  

  const [previousPitchData, setPreviousPitchData] = useState([]);
  const [polylinePoints, setPolylinePoints] = useState([]);
  
  // Normalize pitch data between 0 (A3) and 1 (C6)
  let minimumMIDI=57 //A3
  let maximumMIDI=84 //C6

  const spacing = 10; // Spacing between points
  //let svgWidth =1000 ;// pitchData.length * spacing;
  //let svgHeight = 0;

  useEffect(()=> {
    //THIS SHOULD NOT BE DONE HERE, IT'S REDUNDANT >:(
    //const containerElement = containerRef.current;
    //console.log(containerElement);
    //const rect = containerElement.getBoundingClientRect();
    //svgWidth =rect.offsetWidth ;
    //svgHeight =rect.offsetHeight ;

    // New values added to pitchdata
    const newValues = props.pitchData.filter((value) => !previousPitchData.includes(value));
    const newNormalizedData = newValues.map(
      (value) =>
        (freq2midipitch(value) - minimumMIDI) /
        (maximumMIDI - minimumMIDI)
    )
    // Actualizar el estado anterior con el nuevo estado
    setPreviousPitchData(props.pitchData);
    
  
    // Combinar los nuevos datos procesados con los datos anteriores
    setPolylinePoints((prevPolylinePoints) => {
      //console.log("size of newNormalizedData ", newNormalizedData.length);
    
      // Mapear y agregar las coordenadas de los nuevos valores al estado anterior
      const newPolylinePoints = newNormalizedData.map((value, index) => {
        //console.log("indez ", props.pitchData.length - 2);
    
        const x = props.pitchDataPosX[props.pitchData.length - 1] - rect.left;
        const y = 100 - value * 100;//props.pitchDataPosY[pitchData.length - 1] //- rect.top;//100 - value * 100;
        //console.log("X, y", x, y);
    
        return [x, y]; // Return a coordinate pair as an array [x, y]
      });
    
      // Combinar las coordenadas anteriores con las nuevas
      return [...prevPolylinePoints, ...newPolylinePoints]; // Combine arrays
    });

    /*setPolylinePoints((prevPolylinePoints) => {
      console.log("size of newNormalizedData ", newNormalizedData.length)
      // Mapear y agregar las coordenadas de los nuevos valores al estado anterior
      const newPolylinePoints = newNormalizedData.map((value, index) => {
        console.log("indez ", pitchData.length-2)
        const x = props.pitchDataPosX[pitchData.length-1] - rect.left;//(prevPolylinePoints.split(' ').length + index) * spacing; //
        const y = 100 - value * 100;
        console.log("X,y", x,y);
        return `${x},${y}`;
        });
      // Combinar las coordenadas anteriores con las nuevas
      return prevPolylinePoints + ' ' + newPolylinePoints.join(' ');
    });*/
  
  }, [props.pitchData, previousPitchData]);

  // Style
  //THIS IS WRONG, THE LOCATION SHOULD BE DEFINED IN OpenSheetMusicDisplay.js
  /*container = document.getElementById('osmdSvgPage1');
  staffBox = container.querySelector('staffline'); 
  let topValue=0
  let leftValue=0
  if (staffBox){
    const coord = staffBox.getBoundingClientRect();
    topValue=coord.top
    leftValue=coord.left
  }

  const style = {
    position: "absolute",
    //overflowX: "auto",
    position: "absolute",
    top: topValue, // Ajusta la posición vertical según tus necesidades
    left: leftValue, // Ajusta la posición horizontal según tus necesidades
  };*/

  return (
    <div ref={containerRef}>
      <svg width={props.width} height={props.height}>
        {polylinePoints.map(([x, y], index) => (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={2} // El radio del círculo que representa el punto
            fill="red" // Color del punto
          />
        ))}
      </svg>
    </div>
  );

  /*return (
    <div ref={containerRef} >
      <svg  width={svgWidth}>
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="red"
          strokeDasharray="2"
          style={style}
        />
      </svg>
    </div>
  );*/
};

export default LineChart;