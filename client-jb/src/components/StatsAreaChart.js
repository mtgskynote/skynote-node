import React from "react";
import { Line } from "react-chartjs-2";
import areaChartCSS from "./StatsAreaChart.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const formatDate = (date) => {
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  return year + "-" + month + "-" + day;
};

const NumberOfRecStats = (props) => {
  if (props.dates !== null && props.levels !== null) {
    //Remove irrelevant info from dates
    const shortDates = props.dates.map((dateString) =>
      dateString.substring(0, 10)
    );
    //This part gets the last 7 days
    const currentDate = new Date();
    const dateArray = [];
    for (var i = 0; i < 7; i++) {
      var previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - i);
      dateArray.push(formatDate(previousDate));
    }
    //Now I filter the recordings to use only the ones in the last week, and array them by level
    const dataPreCount = new Map();
    shortDates.forEach((date, index) => {
      if (date >= dateArray[dateArray.length - 1]) {
        if (dataPreCount.has(props.levels[index])) {
          const existingValue = dataPreCount.get(props.levels[index]);
          dataPreCount.set(props.levels[index], [...existingValue, date]);
        } else {
          dataPreCount.set(props.levels[index], [date]);
        }
      }
    });
    //Finally I check if recordings where done in the same day
    var dataFiltered = {};
    const dataForDrawing = {};
    dataPreCount.forEach(function (value, key) {
      dataFiltered = {};
      //For every level, I check the dates
      dateArray.forEach(function (date) {
        const count = value.filter((element) => element === date).length;
        dataFiltered[date] = count;
      });
      dataForDrawing[key] = dataFiltered;
    });

    const generateColor = (howMany) => {
      const baseColor = [218, 43, 67]; //Hue should change, saturation and brightness should be fixed
      const colorArray = [];
      howMany.forEach((key, index) => {
        const newColor = baseColor[0] + (key * 360) / howMany.length;
        const newHue = newColor >= 360 ? newColor - 360 : newColor;
        colorArray[index] = [newHue, baseColor[1], baseColor[2]];
      });
      return colorArray.reverse();
    };

    const generateDatasets = (dataForDrawing) => {
      const datasets = [];
      const keys = Object.keys(dataForDrawing);
      const colorArray = generateColor(keys);
      keys.forEach((key, index) => {
        const lineData = Object.values(dataForDrawing[key]).reverse();
        const dataset = {
          fill: true,
          label: `Level ${key}`,
          data: lineData,
          borderColor: `hsla(${colorArray[index][0]}, ${colorArray[index][1]}%, ${colorArray[index][2]}%, 1)`, //'#88A2CF'
          backgroundColor: `hsla(${colorArray[index][0]}, ${colorArray[index][1]}%, ${colorArray[index][2]}%, 0.5)`,
        };
        datasets.push(dataset);
      });
      return datasets;
    };

    const data = {
      labels: dateArray
        .reverse()
        .map((dateString) => dateString.substring(5, 10)),
      datasets: generateDatasets(dataForDrawing),
    };

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          beginAtZero: true,
          min: 0,
          ticks: {
            stepSize: 25,
          },
        },
        y: {
          ticks: {
            stepSize: 1,
          },
        },
      },
    };

    return (
      <div className={areaChartCSS.container}>
        <h4 className={areaChartCSS.title}>Number of Recordings</h4>
        <Line data={data} options={options} className={areaChartCSS.chart} />
      </div>
    );
  }
};

export default NumberOfRecStats;
