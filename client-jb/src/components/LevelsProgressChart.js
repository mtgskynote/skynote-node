import React, { useEffect, useState } from 'react'
import Chart from 'chart.js/auto'

const LevelsProgressChart = ({ id, starPercentages }) => {
  const [labels, setLabels] = useState(null)

  useEffect(() => {
    if (starPercentages !== null) {
      const labels = starPercentages.map((_, index) => `Level ${index + 1}`)
      setLabels(labels)
    }
  }, [starPercentages])

  useEffect(() => {
    const ctx = document.getElementById(id).getContext('2d')

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
                return value + '%'
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
    })
    return () => {
      myChart.destroy() // Clean up chart on component unmount
    }
  }, [starPercentages, labels, id])

  return <canvas id={id} />
}

export default LevelsProgressChart
