import { ListItem, ListItemText, List, Grid, Box } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { Rating } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
// import Header and LineChart from components/Header.js
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import Wrapper from "../../assets/wrappers/StatsContainer";
import { useAppContext } from "../../context/appContext";
import { getAllRecData } from "../../utils/studentRecordingMethods.js";

ChartJS.register(ArcElement, Tooltip, Legend);


const useStyles = makeStyles((theme) => ({
  gridClassName: {
   //boxShadow: "1px 10px 5px",
    //position: "relative",
  },
  // other classes here
}));

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
  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [scoresData, setScoresData] = useState(null);
  const [recordingList, setRecordingList] = useState(null);
  const [recordingNames, setRecordingNames] = useState(null);
  const [recordingStars, setRecordingStars] = useState(null);
  const [recordingScores, setRecordingScores] = useState(null);
  const [recordingDates, setRecordingDates] = useState(null);
  const [recordingSkills, setRecordingSkills] = useState(null);
  const [recordingLevels, setRecordingLevels] = useState(null);
  const classes = useStyles();

  const fetchDataFromAPI = () => {

    getCurrentUser() // fetchData is already an async function
      .then((result) => {
        console.log(`getCurentUser() has returnd this result: ${JSON.stringify(result)}`);
        setUserData(result);
      }).catch((error) => {
        console.log(`getCurentUser() error: ${error}`)
        // Handle errors if necessary
      })

    };

    //get User Data
    useEffect(()=>{
      
      if(userData===null){
        fetchDataFromAPI();
      }
      console.log(userData)
    },[userData])

    //get Scores data
    useEffect(() => {
      const data= JSON.parse(localStorage.getItem("scoreData"));
      setScoresData(data);
    }, []); // Only once

    //get Recordings Data for this user
    useEffect(()=>{
      if(userData!==null && scoresData!==null){
        getAllRecData(userData.id).then((result) => {
          setRecordingList(JSON.stringify(result));
          // Define options for formatting date
          /*const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          };*/
          /*setRecordingDates(result.map((recording) => {
            //Set correct date format
            const recordingDate = new Date(recording.recordingDate);
            return recordingDate.toLocaleDateString("es-ES", options);
          }))*/
          setRecordingNames(result.map((recording) => recording.recordingName));
          setRecordingStars(result.map((recording) => recording.recordingStars));
          setRecordingDates(result.map((recording) => recording.recordingDate));
          setRecordingLevels(result.map((recording)=> {
            return scoresData.find(item => item._id === recording.scoreID).level
          }))
          setRecordingSkills(result.map((recording)=> {
            return scoresData.find(item => item._id === recording.scoreID).skill
          }))
          setRecordingScores(result.map((recording)=> {
            return scoresData.find(item => item._id === recording.scoreID).title
          }))
        }).catch((error) => {
          console.log(`Cannot get recordings from database: ${error}`)
          // Handle errors if necessary
        })
      }
      console.log(userData)
    },[userData, scoresData])



  return (
    <Wrapper>
      <>
      {/*TITLE*/}
        <Grid>
          <h3 className="logo-text2">Hello {userData?userData.name:""}</h3>
        </Grid>
        
        <Grid container spacing={6}>
          {/*Comment*/}
          <Grid item xs={12}>
            <Box p={2} border={1} textAlign="center">
              Continue Learning... Big Puppy
              <div>
                <Rating name="read-only" value={3} readOnly />
              </div>
            </Box>
          </Grid>
          {/*Note*/}
          <Grid item xs={3}>
            <div container className={`${classes.gridClassName} grid-tile`}>
                
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
          {/*Percentajes Chart*/}
          <Grid item xs={3}>
            <div className="grid-tile">
              <Doughnut
                data={dataset}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                }}
              />
            </div>
          </Grid>
          {/*¿¿¿¿¿*/}
          <Grid item xs={6}>
            <div className="grid-tile">
              <Box height="400px" width="800px" m="-20px 0 0 0">
                <LineChart isDashboard={true} />
              </Box>
            </div>
          </Grid>
          {/*Placeholder*/}
          <Grid item xs={12}>
            <div className="grid-tile">{recordingList}</div>
          </Grid>
        </Grid>
      </>
    </Wrapper>
  );
};

export default Stats;
