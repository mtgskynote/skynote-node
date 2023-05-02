import { ListItem, ListItemText, List, Grid, Box } from "@mui/material";
import { Rating } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
// import Header and LineChart from components/Header.js
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";

ChartJS.register(ArcElement, Tooltip, Legend);

const lineChartOptions = {
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          unit: "month",
        },
        ticks: {
          source: "labels",
        },
      },
    ],
  },
};

const lineChartData = {
  labels: [
    "2022-01-01",
    "2022-02-01",
    "2022-03-01",
    "2022-04-01",
    "2022-05-01",
    "2022-06-01",
    "2022-07-01",
  ],
  datasets: [
    {
      label: "My Data",
      data: [100, 150, 200, 250, 300, 350, 400],
      fill: false,
      borderColor: "#8884d8",
    },
  ],
};

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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box p={2} border={1} textAlign="center">
          Continue Learning.. Big Puppy
          <div>
            <Rating name="read-only" value={3} readOnly />
          </div>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <div className="grid-tile">
          <Box p={2} sx={{ fontSize: 25, textAlign: "left" }}>
            Total Progress
          </Box>
          <Box p={2} sx={{ textAlign: "left" }}>
            <List sx={{ listStyleType: "disc", pl: 4 }}>
              <ListItem sx={{ display: "list-item" }}>
                <ListItemText primary="5 Star Scores" />
              </ListItem>
              <ListItem sx={{ display: "list-item" }}>
                <ListItemText primary="3 Star Scores" />
              </ListItem>
              <ListItem sx={{ display: "list-item" }}>
                <ListItemText primary="Not Started" />
              </ListItem>
            </List>
          </Box>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="grid-tile">
          <div className="grid-tile">
            <Doughnut
              data={dataset}
              options={{
                responsive: true,
                maintainAspectRatio: true,
              }}
            />
          </div>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="grid-tile">
          <Box height="400px" width="800px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className="grid-tile">Tile 3</div>
      </Grid>
    </Grid>
  );
};

export default Stats;
