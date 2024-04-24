import React, { useEffect } from "react";
import Chart from "chart.js/auto";

const RecordingsProgressChart = ({ recordingsData }) => {
  useEffect(() => {
    const ctx = document
      .getElementById("recordingsProgressChart")
      .getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: getPastDaysLabels(),
        datasets: [
          {
            label: "Lessons Recorded",
            data: recordingsData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(231, 233, 237, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(231, 233, 237, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: "category", // Use category scale for discrete data on the x-axis
            grid: {
              display: false, // Hide x-axis grid lines
            },
            ticks: {
              fontSize: 14, // Set font size for the x-axis labels
            },
          },
          y: {
            beginAtZero: true,
            type: "linear", // Use linear scale for the y-axis
            ticks: {
              // Specify the discrete values and corresponding labels
              stepSize: 1, // Set the step size to 1
            },
          },
        },
      },
    });
    return () => {
      myChart.destroy(); // Clean up chart on component unmount
    };
  }, [recordingsData]);

  const getPastDaysLabels = () => {
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString("en-US", { weekday: "long" }));
    }
    return labels;
  };

  return (
    <div className="w-full h-full p-8 bg-slate-50 shadow-md rounded-md overflow-hidden">
      <canvas id="recordingsProgressChart"></canvas>
    </div>
  );
};

export default RecordingsProgressChart;
