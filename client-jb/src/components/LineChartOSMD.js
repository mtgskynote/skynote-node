import React from "react";

const LineChart = ({ pitchData }) => {
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

  const svgWidth = pitchData.length;

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
    </div>
  );
};

export default LineChart;
