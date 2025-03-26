import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js/auto';

/**
 * LevelsProgressChart component to display a horizontal bar chart showing the percentage of stars collected for each level.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique ID for the canvas element where the chart will be rendered.
 * @param {number[]} props.starPercentages - An array of percentages representing the stars collected for each level.
 * @example
 * // Example usage:
 * // <LevelsProgressChart
 * //   id="progressChart"
 * //   starPercentages={[80, 60, 90, 100]}
 * // />
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
