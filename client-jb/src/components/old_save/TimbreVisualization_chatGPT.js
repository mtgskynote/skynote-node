
import React, { useRef, useState } from 'react';
import PieChartGPT from "./pieChart";

const randInt = function (min, max) {
  return Math.floor(min + (max + 1 - min) * Math.random());
};

const TimbreVisualization = () => {
  console.log(`recreate TimbreVisualization`)
  const pieChartRef = useRef(null);

  setInterval(function () {
    handleUpdatePieChartData()
  }, 1000);

  const handleUpdatePieChartData = () => {
    const updatedData = [randInt(0,100), randInt(0,100), randInt(0,100), randInt(0,100),]; // Replace with your updated data
    if (pieChartRef.current) {
      pieChartRef.current.updateData(updatedData);
    }
  };

  return (
    <div>
      <h2>Pie Chart</h2>
      <PieChartGPT ref={pieChartRef} />
    </div>
  );
};

//==================================================================================================

const PieChartGPT = React.forwardRef((props, ref) => {
  console.log(`recreate PieChartGPT`)
  const [data, setData] = useState([10, 20, 30, 40]);

  const updateData = (updatedData) => {
    // Perform the update logic here
    console.log('Updated pie chart data:', updatedData);
    setData(updatedData);
  };

  React.useImperativeHandle(ref, () => ({
    updateData: updateData
  }));

  // Render the pie chart using the data
  // This is just a placeholder component for demonstration purposes
  return (
    <div>
      <p>Data: {data.join(', ')}</p>
      {/* Render the pie chart here */}
    </div>
  );
});



export default TimbreVisualization;
