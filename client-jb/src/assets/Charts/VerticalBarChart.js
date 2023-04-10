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
import { Bar } from 'react-chartjs-2';

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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
export const data = {
  labels ,
  datasets: [
    {
      label: "Sales",
      data:[10,22, 35 ,58, 40,60, 45],
      backgroundColor: "#04e474",
      borderRadius: 25,
    },
    {
      label: "Revenue",
      data:[20,15, 45 ,57, 65,44, 59],
      backgroundColor: "#fc5c9c",
      borderRadius: 25,
    },
  ],
} 


const VerticalBarChart = () => {
  return (
    <div className="chart">
      <h2>Vertical Bar Chart</h2>
      <Bar options={options} data={data}/>
    </div>
  )
}

export default VerticalBarChart