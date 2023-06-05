import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({
  pitchData,
  adjustedTop,
  adjustedLeft,
  normalizedPitch,
}) => {
  const options = {
    plugins: {
      legend: true,
    },
  };

  // linechart data
  const dataset = {
    label: "Frequency",
    data: pitchData,
    backgroundColor: "aqua",
    borderColor: "black",
    pointBorderColor: "aqua",
  };

  const data = {
    labels: Array.from(Array(pitchData.length).keys()).map(String),
    datasets: [dataset],
  };

  // pitch tracking line
  const lineStyle = {
    position: "absolute",
    top: adjustedTop,
    left: adjustedLeft,
    width: "100%",
    height: "2px",
    background: "black",
    transform: `scaleX(${normalizedPitch * 10})`,
    transformOrigin: "left",
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={lineStyle} />
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
