import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import percentagesStarsStatsCSS from './StatsPercentagesStars.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PercentagesStarsStats = (props) => {
  const [percentagesLevel, setPercentagesLevel] = useState(null);

  useEffect(() => {
    const total = props.starsPerLevel;
    const achieved = props.achievedStarsPerLevel;

    if (total !== null && achieved !== null) {
      let percentages = {};
      for (const level in total) {
        if (achieved[level] === undefined) {
          percentages[level] = 0;
        } else {
          percentages[level] = (achieved[level] * 100) / total[level];
        }
      }
      setPercentagesLevel(percentages);
    }
  }, [props]);

  const data = {
    labels: Object.keys(percentagesLevel || {}),
    datasets: [
      {
        label: '% Stars per Level',
        data: Object.values(percentagesLevel || {}),
        backgroundColor: '#88a2cf',
        borderColor: '#88a2cf',
        borderWidth: 5,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
        max: 100, // Set max value to 100
        min: 0, // Set min value to 0
        ticks: {
          stepSize: 25, // Set the step size for x-axis ticks
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    indexAxis: 'y', // Set this to 'y' for horizontal bar chart
    plugins: {
      legend: {
        labels: {
          fontSize: 50, // Set the font size for the legend
        },
      },
    },
  };

  return (
    <div className={percentagesStarsStatsCSS.content}>
      <h4 className={percentagesStarsStatsCSS.title}>Progress</h4>
      <Bar data={data} options={options} />
    </div>
  );
};

export default PercentagesStarsStats;
