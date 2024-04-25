import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useAppContext } from "../../context/appContext";
import { getAllRecData } from "../../utils/studentRecordingMethods.js";
import { getMessages } from "../../utils/messagesMethods.js";
import { getAllAssignments } from "../../utils/assignmentsMethods.js";
import StatsCSS from "./Stats.module.css";
import PercentagesStarsStats from "../../components/StatsPercentagesStars.js";
import StatsRecentRecordings from "../../components/StatsRecentRecordings.js";
import NumberOfRecStats from "../../components/StatsAreaChart.js";
import StatsGeneral from "../../components/StatsGeneral.js";
import StatsTasksSection from "../../components/StatsTasksSection.js";
import LessonCard from "../../components/LessonCard.js";
import RecordingsProgressChart from "../../components/RecordingsProgressChart.js";
import LevelsProgressChart from "../../components/LevelsProgressChart.js";

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
  const [recentScores, setRecentScores] = useState({});
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [unansweredTasks, setUnansweredTasks] = useState(null);
  const [lastWeekRecordings, setLastWeekRecordings] = useState(null);

  const reloadRecordingsCallback = (idDelete) => {
    //delete recording from all arrays
    setRecordingNames(
      recordingNames.filter(
        (item, index) => index !== recordingIds.indexOf(idDelete)
      )
    );
    setRecordingList(
      JSON.stringify(
        JSON.parse(recordingList).filter(
          (item, index) => item.recordingId !== idDelete
        )
      )
    );
    setRecordingStars(
      recordingStars.filter(
        (item, index) => index !== recordingIds.indexOf(idDelete)
      )
    );
    setRecordingScoresTitles(
      recordingScoresTitles.filter(
        (item, index) => index !== recordingIds.indexOf(idDelete)
      )
    );
    setRecordingScoresIds(
      recordingScoresIds.filter(
        (item, index) => index !== recordingIds.indexOf(idDelete)
      )
    );
    setRecordingScoresXML(
      recordingScoresXML.filter(
        (item, index) => index !== recordingIds.indexOf(idDelete)
      )
    );
    setRecordingDates(
      recordingDates.filter(
        (item, index) => index !== recordingIds.indexOf(idDelete)
      )
    );
    setRecordingSkills(
      recordingSkills.filter(
        (item, index) => index !== recordingIds.indexOf(idDelete)
      )
    );
    setRecordingLevels(
      recordingLevels.filter(
        (item, index) => index !== recordingIds.indexOf(idDelete)
      )
    );
    setRecordingIds(
      recordingIds.filter(
        (item, index) => index !== recordingIds.indexOf(idDelete)
      )
    );
    //this will trigger the reloading of the useEffect in charge of sending data to child components
  };

  const fetchDataFromAPI = () => {
    getCurrentUser() // fetchData is already an async function
      .then((result) => {
        setUserData(result);
      })
      .catch((error) => {
        console.log(`getCurentUser() error: ${error}`);
      });
  };

  //get User Data
  useEffect(() => {
    if (userData === null) {
      fetchDataFromAPI();
    }
  }, [userData]);

  //get Scores data
  useEffect(() => {
    // import local data
    const local = JSON.parse(localStorage.getItem("scoreData"));
    // save in state
    setScoresData(local);
    // Count the total number of stars per level, and save
    const levelCounts = {};
    local.forEach((entry) => {
      const level = entry.level;
      // Check if the level is already in the counts object, if not, initialize it to 1
      if (levelCounts[level] === undefined) {
        levelCounts[level] = 3; // 3 stars per score maximum
      } else {
        // If the level is already in the counts object, increment the count
        levelCounts[level] += 3;
      }
    });
    setStarsPerLevel(levelCounts);
  }, []); // Only once

  //get Recordings Data for this user
  useEffect(() => {
    if (userData !== null && scoresData !== null) {
      getAllRecData(userData.id)
        .then((result) => {
          setRecordingList(JSON.stringify(result));
          setRecordingNames(result.map((recording) => recording.recordingName));
          setRecordingIds(result.map((recording) => recording.recordingId));
          setRecordingStars(
            result.map((recording) => recording.recordingStars)
          );
          setRecordingDates(result.map((recording) => recording.recordingDate));
          setRecordingLevels(
            result.map((recording) => {
              return scoresData.find((item) => item._id === recording.scoreID)
                .level;
            })
          );
          setRecordingSkills(
            result.map((recording) => {
              return scoresData.find((item) => item._id === recording.scoreID)
                .skill;
            })
          );
          setRecordingScoresTitles(
            result.map((recording) => {
              return scoresData.find((item) => item._id === recording.scoreID)
                .title;
            })
          );
          setRecordingScoresXML(
            result.map((recording) => {
              return scoresData.find((item) => item._id === recording.scoreID)
                .fname;
            })
          );
          setRecordingScoresIds(result.map((recording) => recording.scoreID));

          const today = new Date();
          const lastWeek = new Date(today);
          lastWeek.setDate(lastWeek.getDate() - 6); // Calculate the date 7 days ago

          const countsPerDay = Array(7).fill(0);

          // Filter the studentData array to get entries within the last week
          result.forEach((recording) => {
            const recordingDate = new Date(recording.recordingDate); // Assuming the date attribute is a string representation of a date

            const dayOffset = Math.floor(
              (today - recordingDate) / (1000 * 60 * 60 * 24)
            );
            const lastIndex = 6; // The last index of the array
            const reverseIndex = lastIndex - dayOffset;

            if (reverseIndex >= 0 && reverseIndex <= lastIndex) {
              countsPerDay[reverseIndex]++;
            }
          });

          setLastWeekRecordings(countsPerDay);
        })
        .catch((error) => {
          console.log(`Cannot get recordings from database: ${error}`);
        });
      getMessages(userData.id, userData.teacher)
        .then((result) => {
          var messageCount = 0;
          //I have to filter the messages sent by the teacher that have seen=false
          result.forEach((message, index) => {
            // Check if the message is sent by the teacher and not seen
            if (message.sender === userData.teacher && message.seen === false) {
              messageCount = messageCount + 1;
            }
          });
          setUnreadMessages(messageCount);
        })
        .catch((error) => {
          console.log(
            `Cannot get number of chat messages from database: ${error}`
          );
        });

      getAllAssignments(userData.id)
        .then((result) => {
          var taskCount = 0;
          if (result.length !== 0) {
            result.forEach((assignment) => {
              assignment.tasks.forEach((task) => {
                if (task.answer === null || task.answer === undefined) {
                  taskCount = taskCount + 1;
                }
              });
            });
          }
          setUnansweredTasks(taskCount);
        })
        .catch((error) => {
          console.log(
            `Cannot get number of pending tasks from database: ${error}`
          );
        });
    }
  }, [userData, scoresData]);

  //When recordings info is loaded, get neeeded info
  useEffect(() => {
    if (recordingList !== null) {
      // number of stars achieved per level
      // store the best score for each scoreID
      const bestScores = {};
      const copy = JSON.parse(recordingList);
      copy.forEach((entry) => {
        const scoreID = entry.scoreID;
        const recordingStars = entry.recordingStars;
        const level = scoresData.find((score) => score._id === scoreID).level;
        if (!bestScores[level]) {
          bestScores[level] = {};
        }
        // Check if the scoreID is already in the bestScores object
        if (
          !bestScores[level][scoreID] ||
          bestScores[level][scoreID] < recordingStars
        ) {
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
      setAchievedStarsPerLevel(starSums);
      ////////////////////////////////////////////////////////

      const allEntries = {
        names: recordingNames,
        scoresTitles: recordingScoresTitles,
        scoresIds: recordingScoresIds,
        scoresXML: recordingScoresXML,
        ids: recordingIds,
        skills: recordingSkills,
        levels: recordingLevels,
        stars: recordingStars,
        dates: recordingDates,
      };

      setRecentRecordings(allEntries);
      ////////////////////////////////////////////////////////
    }
  }, [recordingList, recordingNames]);

  useEffect(() => {
    if (recentRecordings != null) {
      const uniqueScores = {};

      recentRecordings.scoresTitles.forEach((title, index) => {
        // const xml = recentRecordings.scoresXML[index];
        const skill = recentRecordings.skills[index];
        const level = recentRecordings.levels[index];
        const stars = recentRecordings.stars[index];
        const xml = recentRecordings.scoresXML[index];
        const id = recentRecordings.ids[index];

        if (!uniqueScores[title] || stars > uniqueScores[title].stars) {
          // If not encountered before or if the current stars are greater than the stored stars, update the entry
          uniqueScores[title] = { skill, level, stars, xml, id };
        }
      });

      const top10Scores = {};
      let count = 0;
      for (const key in uniqueScores) {
        if (count >= 10) break;
        top10Scores[key] = uniqueScores[key];
        count++;
      }

      setRecentScores(top10Scores);
    }
  }, [recentRecordings]);

  console.log(lastWeekRecordings);
  // w-full h-full p-8 bg-slate-50 shadow-md rounded-md overflow-hidden

  return (
    <div className={`px-12 ${StatsCSS.container}`}>
      <div className="pt-6 pb-6">
        <h3 className="font-normal my-6">Continue Recording</h3>
        <div className="overflow-x-auto whitespace-no-wrap no-scrollbar">
          <div className="inline-flex items-start space-x-8 py-4">
            {Object.keys(recentScores).map((title, index) => {
              return (
                <LessonCard
                  key={index}
                  title={title}
                  skill={recentScores[title].skill}
                  level={recentScores[title].level}
                  stars={recentScores[title].stars}
                  xml={recentScores[title].xml}
                  id={recentScores[title].id}
                />
              );
            })}
          </div>
        </div>
      </div>
      <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      <div className="pt-1 pb-6">
        <h3 className="font-normal my-6">Latest Assignments</h3>
        <div className="overflow-x-auto whitespace-no-wrap no-scrollbar">
          <div className="inline-flex items-start space-x-8 py-4"></div>
        </div>
      </div>
      <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      <div className="pt-1 pb-12">
        <h3 className="font-normal my-6 pb-2">Your Progress</h3>
        <div className="flex justify-between">
          <div className="w-1/2 mr-4 p-4 bg-white border border-slate-50 shadow-md rounded-sm overflow-hidden">
            <p className="text-lg text-[#383838] font-bold mb-4">
              Lessons Recorded This Week
            </p>
            <RecordingsProgressChart
              id="recordingsProgressChart"
              recordingsData={lastWeekRecordings}
            />
          </div>
          <div className="w-1/2 ml-4">
            <div>{/* <LevelsProgressChart /> */}</div>
          </div>
        </div>
      </div>

      <div className={StatsCSS.dashboard}>
        <div className={StatsCSS.left}>
          <div className={StatsCSS.item}>
            <StatsGeneral
              numberRecordings={recordingNames}
              unreadMessages={unreadMessages}
              unansweredTasks={unansweredTasks}
            />
          </div>

          <div className={StatsCSS.item}>
            <PercentagesStarsStats
              starsPerLevel={starsPerLevel}
              achievedStarsPerLevel={achievedStarsPerLevel}
            />
          </div>
          <div className={StatsCSS.item}>
            <NumberOfRecStats dates={recordingDates} levels={recordingLevels} />
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
