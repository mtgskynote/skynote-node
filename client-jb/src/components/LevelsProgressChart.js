import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js/auto';

/**
 * The LevelsProgressChart component displays a horizontal bar chart showing the percentage of stars collected for each level.
 *
 * Props:
 * - id (string): The unique identifier for the canvas element.
 * - starPercentages (array of numbers): The percentages of stars collected for each level.
 *
 * The component:
 * - Uses useState to manage the labels for the chart.
 * - Uses useEffect to generate labels based on starPercentages and update the chart.
 *
 * The chart:
 * - Displays levels on the y-axis and percentages on the x-axis.
 * - Hides grid lines and the legend for a cleaner look.
 */
const LevelsProgressChart = ({ id, starPercentages }) => {
  const [labels, setLabels] = useState(null);

  useEffect(() => {
    if (starPercentages !== null) {
      const labels = starPercentages.map((_, index) => `Level ${index + 1}`);
      setLabels(labels);
    }
  }, [starPercentages]);

  useEffect(() => {
    const ctx = document.getElementById(id).getContext('2d');

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Percentage of Stars Collected',
            data: starPercentages,
            backgroundColor: 'rgba(164, 190, 92, 0.2)',
            borderColor: 'rgba(164, 190, 92, 1)',
            borderWidth: 2,
            barPercentage: 0.7,
          },
        ],
      },
      options: {
        indexAxis: 'y',
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
            beginAtZero: true,
            min: 0,
            max: 100,
            type: 'linear',
            grid: {
              display: false,
            },
            ticks: {
              stepSize: 20,
              callback: function (value) {
                return value + '%';
              },
              font: {
                size: 15,
                family: 'poppins',
                weight: 500,
              },
            },
          },
          y: {
            type: 'category',
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 15,
                family: 'poppins',
                weight: 500,
              },
            },
          },
        },
      },
    });
    return () => {
      myChart.destroy(); // Clean up chart on component unmount
    };
  }, [starPercentages, labels, id]);

  return <canvas id={id} />;
};

LevelsProgressChart.propTypes = {
  id: PropTypes.string.isRequired,
  starPercentages: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default LevelsProgressChart;
