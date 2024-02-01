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
import StatsCSS from './Stats.module.css'
import PercentagesStarsStats from "../../components/StatsPercentagesStars.js";
import StatsRecentRecordings from "../../components/StatsRecentRecordings.js";

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
  const [recordingIds, setRecordingIds] = useState(null);
  const [recordingStars, setRecordingStars] = useState(null);
  const [recordingScoresTitles, setRecordingScoresTitles] = useState(null);
  const [recordingScoresIds, setRecordingScoresIds] = useState(null);
  const [recordingScoresXML, setRecordingScoresXML] = useState(null);
  const [recordingDates, setRecordingDates] = useState(null);
  const [recordingSkills, setRecordingSkills] = useState(null);
  const [recordingLevels, setRecordingLevels] = useState(null);
  const [starsPerLevel, setStarsPerLevel] = useState(null);
  const [achievedStarsPerLevel, setAchievedStarsPerLevel] = useState(null);
  const [recentRecordings, setRecentRecordings] = useState(null);
  const classes = useStyles();

  const fetchDataFromAPI = () => {

    getCurrentUser() // fetchData is already an async function
      .then((result) => {
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
      // import local data
      const local= JSON.parse(localStorage.getItem("scoreData"));
      // save in state
      setScoresData(local);
      // Count the total number of stars per level, and save
      const levelCounts = {};
      console.log("local ", local)
      local.forEach(entry => {
        const level = entry.level;
        // Check if the level is already in the counts object, if not, initialize it to 1
        if (levelCounts[level] === undefined) {
          levelCounts[level] = 3; // 3 stars per score maximum
        } else {
          // If the level is already in the counts object, increment the count
          levelCounts[level]+=3;
        }
      });
      setStarsPerLevel(levelCounts)
    }, []); // Only once

    //get Recordings Data for this user
    useEffect(()=>{
      if(userData!==null && scoresData!==null){
        getAllRecData(userData.id).then((result) => {
          setRecordingList(JSON.stringify(result));
          console.log(result)
          setRecordingNames(result.map((recording) => recording.recordingName)); 
          setRecordingIds(result.map((recording) => recording.recordingId)); 
          setRecordingStars(result.map((recording) => recording.recordingStars)); 
          setRecordingDates(result.map((recording) => recording.recordingDate)); 
          setRecordingLevels(result.map((recording)=> {
            return scoresData.find(item => item._id === recording.scoreID).level 
          }))
          setRecordingSkills(result.map((recording)=> {
            return scoresData.find(item => item._id === recording.scoreID).skill 
          }))
          setRecordingScoresTitles(result.map((recording)=> {
            console.log(scoresData.find(item => item._id === recording.scoreID).title)
            return scoresData.find(item => item._id === recording.scoreID).title  
          }))
          setRecordingScoresXML(result.map((recording)=> {
            return scoresData.find(item => item._id === recording.scoreID).fname  
          }))
          setRecordingScoresIds(result.map((recording) => recording.scoreID)); 
        }).catch((error) => {
          console.log(`Cannot get recordings from database: ${error}`)
          // Handle errors if necessary
        })
      }
      console.log(userData)
    },[userData, scoresData])

    //When recordings info is loaded, get neeeded info 
    useEffect(()=>{
      if(recordingList!==null){
        console.log("recordingList ", recordingList)

        //number of stars achieved per level/////////////////
        // store the best score for each scoreID
        const bestScores = {};
        const copy=JSON.parse(recordingList)
        copy.forEach(entry => {
          const scoreID = entry.scoreID;
          const recordingStars = entry.recordingStars;
          const level = scoresData.find(score => score._id === scoreID).level;
          if (!bestScores[level]) {
            bestScores[level] = {};
          }
          // Check if the scoreID is already in the bestScores object
          if (!bestScores[level][scoreID] || bestScores[level][scoreID] < recordingStars) {
            // If not or if the current recordingStars is greater, update the best score
            bestScores[level][scoreID] = recordingStars;
          }
        });
        // sum up all stars for same level
        const starSums = {};
        for (const level in bestScores) {
          const scoresStars = bestScores[level];
          let sum = 0;
          for (const scoreStar in scoresStars) {
            const stars = scoresStars[scoreStar];
            sum += stars;
          }
          starSums[level] = sum;
        }
        setAchievedStarsPerLevel(starSums)
        console.log("list of stars achieved ", bestScores)
        ////////////////////////////////////////////////////////


        // Get 4 most recent recordings ////////////////////////
        const lastFourNames = recordingNames.slice(-4);
        const lastFourScoresTitles = recordingScoresTitles.slice(-4);
        const lastFourScoresIds = recordingScoresIds.slice(-4);
        const lastFourScoresXML = recordingScoresXML.slice(-4);
        const lastFourIds = recordingIds.slice(-4);
        const lastFourSkills = recordingSkills.slice(-4);
        const lastFourLevels = recordingLevels.slice(-4);
        const lastFourStars = recordingStars.slice(-4);
        const lastFourDates = recordingDates.slice(-4);

        const lastFourEntries = {
          names:lastFourNames,
          scoresTitles:lastFourScoresTitles,
          scoresIds:lastFourScoresIds,
          scoresXML:lastFourScoresXML,
          ids:lastFourIds,
          skills:lastFourSkills,
          levels:lastFourLevels,
          stars:lastFourStars,
          dates:lastFourDates,
        }

        setRecentRecordings(lastFourEntries)
        ////////////////////////////////////////////////////////



      }  


    },[recordingList])


  return (
    <div className={StatsCSS.container}>
      <h1 className={StatsCSS.profile}>Hello {userData?userData.name:""}</h1>
      
      <div className={StatsCSS.dashboard}> 
        <div className={StatsCSS.left}> 
        
          <div className={StatsCSS.item}> 
            <PercentagesStarsStats
              starsPerLevel={starsPerLevel}
              achievedStarsPerLevel={achievedStarsPerLevel}
            />
          </div>
        </div>
        <div className={StatsCSS.right}>
          <div className={StatsCSS.item}>
            <StatsRecentRecordings
              recentRecordings={recentRecordings}
            />
          </div>
        </div>
       </div>
    </div>
  );
};

export default Stats;
