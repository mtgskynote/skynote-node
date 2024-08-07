import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js/auto';

const RecordingsProgressChart = ({ id, recordingsData }) => {
  useEffect(() => {
    const ctx = document.getElementById(id).getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255,227,19,0.8)');
    gradient.addColorStop(0.4, 'rgba(255,186,0,0.8)');
    gradient.addColorStop(1, 'rgba(255,85,3,0.8)');

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: getPastDaysLabels(),
        datasets: [
          {
            label: 'Lessons Recorded',
            data: recordingsData,
            backgroundColor: gradient,
            borderColor: 'rgba(255,186,0,1)',
            borderWidth: 2,
            barPercentage: 0.7,
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
            type: 'category', // Use category scale for discrete data on the x-axis
            grid: {
              display: false, // Hide x-axis grid lines
            },
            ticks: {
              font: {
                size: 15,
                family: 'poppins',
                weight: 500,
              },
            },
          },
          y: {
            beginAtZero: true,
            type: 'linear', // Use linear scale for the y-axis
            grace: 1,
            ticks: {
              stepSize: 1, // Set the step size to 1
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
  }, [recordingsData, id]);

  const getPastDaysLabels = () => {
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(
        date.toLocaleDateString('en-US', {
          weekday: 'short',
        })
      );
    }
    return labels;
  };

  return <canvas id={id}></canvas>;
};

RecordingsProgressChart.propTypes = {
  id: PropTypes.string.isRequired,
  recordingsData: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default RecordingsProgressChart;
