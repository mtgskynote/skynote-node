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
  indexAxis: 'y' ,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
  },
};

const labels = ['January', 'February' , 'March', 'April' , 'May', 'June' , 'July']

export const data = {
  labels ,
  datasets: [
    {
      label: "Sales",
      data:[10,22, 35 ,58, 40,60, 45],
      backgroundColor: "#0434ec",
      borderRadius: 25,
    },
  ],
} 

const HorizontalBarChart = () => {
  return (
    <div className="chart">
      <h2>Horizontal Bar Chart</h2>
      <Bar options={options} data={data}/>
    </div>
  )
}

export default HorizontalBarChart