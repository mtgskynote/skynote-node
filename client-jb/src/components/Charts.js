import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import DoughnutChart from "./DoughnutChart";
import "./Charts.css";

const Charts = () => {
  return (
    <div className="charts">
      <div>
        <DoughnutChart />
      </div>
    </div>
  );
};

export default Charts;
