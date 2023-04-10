import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May'];

export const data = {
  labels ,
  datasets: [
      {
          label: 'Sales',
          data: ['60',"72","55","85","75"],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132,0.5)',
          borderWidth: 5
      },
      {
          label: 'Revenue',
          data: [19,32,55,45,85],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderWidth: 5
      },
  ],
};

const LineChart = () => {
  return (
    <div className="chart">
      <h2>Line Chart</h2>
      <Line options={options} data={data}/>
    </div>
  )
}

export default LineChart