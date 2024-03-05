import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAppContext } from "../../context/appContext";
import { getAllRecData } from "../../utils/studentRecordingMethods.js";
import { getMessages } from "../../utils/messagesMethods.js";
import { getAllAssignments} from "../../utils/assignmentsMethods.js";
import StatsCSS from './Stats.module.css'
import PercentagesStarsStats from "../../components/StatsPercentagesStars.js";
import StatsRecentRecordings from "../../components/StatsRecentRecordings.js";
import NumberOfRecStats from "../../components/StatsAreaChart.js";
import StatsGeneral from "../../components/StatsGeneral.js";
import StatsTasksSection from "../../components/StatsTasksSection.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [unansweredTasks, setUnansweredTasks] = useState(null);

  const reloadRecordingsCallback=(idDelete)=>{
    //delete recording from all arrays
    setRecordingNames(recordingNames.filter((item, index) => index !== recordingIds.indexOf(idDelete)));
    setRecordingList(JSON.stringify(JSON.parse(recordingList).filter((item, index) => item.recordingId !== idDelete)));
    setRecordingStars(recordingStars.filter((item, index) => index !== recordingIds.indexOf(idDelete)));
    setRecordingScoresTitles(recordingScoresTitles.filter((item, index) => index !== recordingIds.indexOf(idDelete)));
    setRecordingScoresIds(recordingScoresIds.filter((item, index) => index !== recordingIds.indexOf(idDelete)));
    setRecordingScoresXML(recordingScoresXML.filter((item, index) => index !== recordingIds.indexOf(idDelete)));
    setRecordingDates(recordingDates.filter((item, index) => index !== recordingIds.indexOf(idDelete)));
    setRecordingSkills(recordingSkills.filter((item, index) => index !== recordingIds.indexOf(idDelete)));
    setRecordingLevels(recordingLevels.filter((item, index) => index !== recordingIds.indexOf(idDelete)));
    setRecordingIds(recordingIds.filter((item, index) => index !== recordingIds.indexOf(idDelete)));
    //this will trigger the reloading of the useEffect in charge of sending data to child components
  }

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
    },[userData])

    //get Scores data
    useEffect(() => {
      // import local data
      const local= JSON.parse(localStorage.getItem("scoreData"));
      // save in state
      setScoresData(local);
      // Count the total number of stars per level, and save
      const levelCounts = {};
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
        getMessages(userData.id, userData.teacher).then((result)=>{
          var messageCount=0
          //I have to filter the messages sent by the teacher that have seen=false
          result.forEach((message, index) => {
            // Check if the message is sent by the teacher and not seen
            if (message.sender === userData.teacher && message.seen === false) {
                messageCount = messageCount + 1;
            }
          });
          setUnreadMessages(messageCount)
        }).catch((error) => {
          console.log(`Cannot get number of chat messages from database: ${error}`)
          // Handle errors if necessary
        })

        getAllAssignments(userData.id).then((result)=>{
          var taskCount=0;
          if(result.length!==0){
              result.foreach((assignment,index)=>{   
                assignment.tasks.foreach((task, index)=>{
                  if(task.answer===null || task.answer===undefined){
                    taskCount=taskCount+1;
                  }
                })

              })
          }
          setUnansweredTasks(taskCount)
        }).catch((error) => {
          console.log(`Cannot get number of pending tasks from database: ${error}`)
          // Handle errors if necessary
        })

      }
    },[userData, scoresData])

    //When recordings info is loaded, get neeeded info 
    useEffect(()=>{
      if(recordingList!==null){

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
        ////////////////////////////////////////////////////////

        const allEntries = {
          names:recordingNames,
          scoresTitles:recordingScoresTitles,
          scoresIds:recordingScoresIds,
          scoresXML:recordingScoresXML,
          ids:recordingIds,
          skills:recordingSkills,
          levels:recordingLevels,
          stars:recordingStars,
          dates:recordingDates,
        }

        setRecentRecordings(allEntries)
        ////////////////////////////////////////////////////////



      }  


    },[recordingList, recordingNames])


  return (
    <div className={StatsCSS.container}>
      <h1 className={StatsCSS.profile}>Hello {userData?userData.name:""}</h1>
      
      <div className={StatsCSS.dashboard}> 
        <div className={StatsCSS.left}> 
          <div className={StatsCSS.item}> 
            <StatsGeneral 
              numberRecordings={recordingNames}
              unreadMessages={unreadMessages}
              unansweredTasks={unansweredTasks}/>
          </div>
        
          <div className={StatsCSS.item}> 
            <PercentagesStarsStats
              starsPerLevel={starsPerLevel}
              achievedStarsPerLevel={achievedStarsPerLevel}
            />
          </div>
          <div className={StatsCSS.item}>
          <NumberOfRecStats
            dates={recordingDates}
            levels={recordingLevels}
          />
          </div>
        </div>
        <div className={StatsCSS.right}>
          <div className={StatsCSS.item}>
            <StatsRecentRecordings
              recentRecordings={recentRecordings}
              reloadRecordingsCallBack={reloadRecordingsCallback}
            />
          </div> 
          <div className={StatsCSS.item}>
            <StatsTasksSection
              recentRecordings={recentRecordings}
              reloadRecordingsCallBack={reloadRecordingsCallback}
            />
          </div> 
        </div>
       </div>
      
    </div>
  );
};

export default Stats;
