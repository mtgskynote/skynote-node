import { Grid } from "@mui/material";
import { Doughnut } from "react-chartjs-2";

function DonutChart() {
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100, 40, 120, 80],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "My Chart",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

function Dashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <div className="grid-tile">Tile 1</div>
      </Grid>
      <Grid item xs={4}>
        <div className="grid-tile">
          <div className="grid-tile">
            <div className="grid-tile">Tile 1</div>
          </div>
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="grid-tile">Tile 3</div>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
