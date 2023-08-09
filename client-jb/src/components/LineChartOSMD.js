import React from "react";

const LineChart = ({ pitchData }) => {
  if (!pitchData || pitchData.length === 0) return null;

  // Normalize pitch data between 0 and 1
  const normalizedData = pitchData.map(
    (value) =>
      (value - Math.min(...pitchData)) /
      (Math.max(...pitchData) - Math.min(...pitchData))
  );

  const spacing = 10; // Spacing between points
  const svgWidth = pitchData.length * spacing;

  // Calculate the polyline points
  const polylinePoints = normalizedData
    .map((value, index) => `${index * spacing},${100 - value * 100}`)
    .join(" ");

  return (
    <div style={{ overflowX: "auto" }}>
      <svg>
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
