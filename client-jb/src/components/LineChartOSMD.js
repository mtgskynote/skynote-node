import React, {useState, useEffect} from "react";

//Convert frequency Hertz to MIDI function
const freq2midipitch = (freq) => {
  return(12 * (Math.log2(freq / 440)) + 69)
}
//let staffBox;
//let container;

//Pitch track line component
const LineChart = (props) => {
  //if (!pitchData || pitchData.length === 0) return null;
  

  const [previousPitchData, setPreviousPitchData] = useState([]);
  const [polylinePoints, setPolylinePoints] = useState('');
  
  // Normalize pitch data between 0 (A3) and 1 (C6)
  let minimumMIDI=57 //A3
  let maximumMIDI=84 //C6

  const spacing = 10; // Spacing between points
  const svgWidth = props.pitchData.length * spacing;

  useEffect(()=> {
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
      // Mapear y agregar las coordenadas de los nuevos valores al estado anterior
      const newPolylinePoints = newNormalizedData.map((value, index) => {
        const x = (prevPolylinePoints.split(' ').length + index) * spacing;
        const y = 100 - value * 100;
        return `${x},${y}`;
        });
      // Combinar las coordenadas anteriores con las nuevas
      return prevPolylinePoints + ' ' + newPolylinePoints.join(' ');
    });
  
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
    //overflowX: "auto",
    position: "absolute",
    top: topValue, // Ajusta la posición vertical según tus necesidades
    left: leftValue, // Ajusta la posición horizontal según tus necesidades
  };*/

  return (
    //<div style={style}>
      <svg width={svgWidth}>
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="red"
          strokeDasharray="2"
        />
      </svg>
    //</div>
  );
};

export default LineChart;