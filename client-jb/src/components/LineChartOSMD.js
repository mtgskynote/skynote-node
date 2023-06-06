import React from "react";
import { Line } from "react-chartjs-2";
import { useState } from "react";

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

  // console.log(newPitchValueArray);

  const data = {
    labels: Array.from(Array(pitchData.length).keys()).map(String),
    datasets: [dataset],
  };

  // console.log("data", data);

  let { currentTop, currentLeft, normalizedPitch } = cursorPosition;

  const lineStyle = {
    position: "absolute",
    top: currentTop,
    left: currentLeft,
    width: "100%",
    height: "2px",
    background: "black",
    transform: `scaleX(${normalizedPitch * 10})`,
    transformOrigin: "left",
  };

  return (
    <div>
      <div style={lineStyle} />
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
