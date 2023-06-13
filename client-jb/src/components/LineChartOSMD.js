import React from "react";
import { Line } from "react-chartjs-2";
// import { useState } from "react";

const LineChart = ({ pitchData, cursorPosition }) => {
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

  // console.log("picth data in line chart", pitchData);

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
    .map((value, index) => `${index * 10},${100 - value * 100}`)
    .join(" ");

  const svgWidth = pitchData.length * 10;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={svgWidth} height="100">
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
