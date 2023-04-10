import React from "react";
//import charts folder files from assets/charts in one go
import {
  HorizontalBarChart,
  VerticalBarChart,
  LineChart,
  AreaChart,
} from "../assets/Charts";

import "./Charts.css";

const Charts = () => {
  return (
    <div className="charts">
      <div>
        <HorizontalBarChart />
      </div>
      <div>
        <VerticalBarChart />
      </div>
      <div>
        <LineChart />
      </div>
      <div>
        <AreaChart />
      </div>
    </div>
  );
};

export default Charts;
