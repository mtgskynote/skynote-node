import { Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/material/styles";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const dataset = {
  labels: ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
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

const Stats = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <div className="grid-tile">Progress Play</div>
      </Grid>
      <Grid item xs={6}>
        <div className="grid-tile">
          <div className="grid-tile">
            <Doughnut data={dataset} />;
          </div>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="grid-tile">Tile 1</div>
      </Grid>
      <Grid item xs={12}>
        <div className="grid-tile">Tile 3</div>
      </Grid>
    </Grid>
  );
};

export default Stats;
