import React from 'react';
import { Line } from 'react-chartjs-2';
import areaChartCSS from './StatsAreaChart.module.css';
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
} from 'chart.js';

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
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  return year + "-" + month + "-" + day;
}

const NumberOfRecStats = (props) => {
  if (props.dates !== null && props.levels !== null) {
    //Remove irrelevant info from dates
    const shortDates = props.dates.map(dateString => dateString.substring(0, 10));
    console.log("Dates:\n", shortDates);
    //Check how many levels
    const allLevels = [...new Set(props.levels)];
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
      if (date > dateArray[dateArray.length-1]){
        if (dataPreCount.has(props.levels[index])) {
          const existingValue = dataPreCount.get(props.levels[index]);
          dataPreCount.set(props.levels[index], [...existingValue, date]);
        } else {
          dataPreCount.set(props.levels[index], [date]);
        }
      }
    });

    //////////////////////////////////////////////////////////////
    /////////////////////HASTA AQUI TODO BIEN/////////////////////
    //////////////////////////////////////////////////////////////

    //Finally I check if recordings where done in the same day
    var dataFiltered = {};
    const dataForDrawing = {}
    dataPreCount.forEach (function(value, key) {
      dataFiltered = {};
      //For every level, I check the dates 
      dateArray.forEach (function(date) {
        const count = value.filter(element => element === date).length;
        dataFiltered[date] = count;
      })
      dataForDrawing[key] = dataFiltered;
    });
    const data = {
        labels: dateArray.reverse().map(dateString => dateString.substring(5, 10)),
        datasets: [
          {
            fill: true,
            label: `Level ${allLevels[0]}`,
            data: Object.values(dataForDrawing[allLevels[0]]).reverse(),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(255, 0, 235, 0.5)',
          },
          {
            fill: true,
            label: `Level ${allLevels[1]}`,
            data: Object.values(dataForDrawing[allLevels[1]]).reverse(),
            borderColor: 'rgba(255, 0, 235, 0.5)',
            backgroundColor: 'rgb(53, 162, 235)',
          }
        ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: true,
    };

    return (
      <div className={areaChartCSS.content}>
        <h4>
          Number of Recordings
        </h4>
        <Line data={data} options={options} />
      </div>
    );
    }
}

export default NumberOfRecStats;