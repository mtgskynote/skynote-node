import React from "react";
import { Line } from "react-chartjs-2";
// import { useState } from "react";

const LineChart = ({ pitchData, cursorPosition }) => {
  // const [pitchData, setPitchData] = useState([]);

  // // Simulating dynamic updates to pitchData
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newPitchValue = Math.random() * 100; // Generate a random value for demonstration
  //     setPitchData((prevData) => [...prevData, newPitchValue]);
  //   }, 1000); // Update every 1 second

  //   return () => clearInterval(interval);
  // }, []);

  const options = {
    plugins: {
      legend: true,
    },
  };

  const dataset = {
    label: "Frequency",
    data: pitchData,
    backgroundColor: "aqua",
    borderColor: "black",
    pointBorderColor: "aqua",
  };

  console.log("picth data in line chart", pitchData);

  const data = {
    labels: Array.from(Array(pitchData.length).keys()).map(String),
    datasets: [dataset],
  };

  // console.log("data", data);
  // console.log("ptich data bla bla bla", dataset.data);

  let { currentTop, currentLeft } = cursorPosition;

  const lineStyle = {
    position: "absolute",
    top: currentTop,
    left: currentLeft,
    width: "100%",
    height: "2px",
    background: "black",
    transform: `scaleX(${dataset.data})`,
    transformOrigin: "left",
  };

  // Normalize pitch data between 0 and 1
  const normalizedData = pitchData.map(
    (value) =>
      (value - Math.min(...pitchData)) /
      (Math.max(...pitchData) - Math.min(...pitchData))
  );

  // Calculate the polyline points
  const polylinePoints = normalizedData
    .map((value, index) => `${index * 10},${300 - value * 300}`)
    .join(" ");

  return (
    <div>
      <svg width="5000" height="300">
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="black"
          strokeDasharray="2"
        />
      </svg>
      {/* <div style={lineStyle} /> */}
      {/* <Line data={data} options={options} /> */}
    </div>
  );
};

export default LineChart;
