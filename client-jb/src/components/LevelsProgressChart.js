import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { renderToStaticMarkup } from "react-dom/server";

const LevelsProgressChart = ({ id, levelsData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const labels = ["Category 1", "Category 2", "Category 3"];
    const data = [5, 3, 7]; // Example data points

    const ctx = chartRef.current.getContext("2d");
    const customImagesPlugin = {
      id: "customImages",
      beforeDraw: (chart) => {
        const { ctx, chartArea } = chart;

        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          meta.data.forEach((element, index) => {
            const value = dataset.data[index];
            const x = element.x;
            const y = element.y;
            const width = element.width;
            const height = element.height;

            const starElement = renderToStaticMarkup(
              <StarRateRoundedIcon style={{ fontSize: 20 }} />
            );

            const img = new Image();
            img.src =
              "data:image/svg+xml;base64," +
              btoa(decodeURIComponent(encodeURIComponent(starElement)));

            const starSize = 20;
            const starCount = Math.round(value); // Adjust based on your data
            for (let i = 0; i < starCount; i++) {
              const starX = x + i * (starSize + 2);
              const starY = y + height / 2 - starSize / 2;
              ctx.drawImage(img, starX, starY, starSize, starSize);
            }
          });
        });
      },
    };

    Chart.register(customImagesPlugin);

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: "rgba(0, 0, 0, 0)", // Transparent background
          },
        ],
      },
      options: {
        indexAxis: "y",
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chart.destroy();
      Chart.unregister(customImagesPlugin);
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default LevelsProgressChart;
