import React, { useEffect, useState, useCallback } from "react";
import {useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import StatsTasksCSS from './StatsTasksSection.module.css'
import { getLatestAssignment } from "../utils/assignmentsMethods.js";

import {
    faFileImport,
    faUser,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const StatsTasksSection = (props) => {
    const navigate = useNavigate();
    const { getCurrentUser } = useAppContext();
    const [userData, setUserData] = useState(null);
    const [assignmentData, setAssignmentData] = useState(null);

    const fetchDataFromAPI = useCallback(() => {
      getCurrentUser() // fetchData is already an async function
        .then((result) => {
          setUserData(result);
        }).catch((error) => {
          console.log(`getCurentUser() error: ${error}`)
          // Handle errors if necessary
        })
    }, [setUserData]);

    const fetchAssignment = useCallback((userData) => {
      getLatestAssignment(userData.id).then((result)=>{
        setAssignmentData(result)
        console.log("Resultado", result[0]);
      })
    }, [setAssignmentData]);

    //get User Data
    useEffect(()=>{
        if(userData===null){
        fetchDataFromAPI();
        }
    },[userData, fetchDataFromAPI]);

    //get latest assignment
    useEffect(()=>{
      if(userData!==null){
          fetchAssignment(userData);
      }
    },[userData, fetchAssignment]);

    /* FOR NOW THIS CODE DOES NOT DISPLAY ANYTHING REAL */

    // Event handler for click on OPEN
  const handleOpen = ()=> {
    console.log("heyo")
    navigate(`/assignments/`)
  }
  
  return (
    <div className={StatsTasksCSS.container}>
      <h4 className={StatsTasksCSS.title}>
        Teacher announcement for this week 
      </h4>
    <div className={StatsTasksCSS.tableBox}> 
        <div>
            <div className={StatsTasksCSS.header}> 
                <div> 
                    Posted on : 23/01/2024 {/* REPLACE BY REAL DATE*/}
                </div>
                <div> 
                    Due on : 30/01/2024{/* REPLACE BY REAL DATE*/}
                </div>
                <button className={StatsTasksCSS.openButton} onClick={() => handleOpen()}> 
                    OPEN <FontAwesomeIcon icon={faFileImport} className={StatsTasksCSS.openIcon} />
                </button>
            </div>
            <div className={StatsTasksCSS.announcementBody}> 
                <div className={StatsTasksCSS.teacher}> 
                    TEACHER   <FontAwesomeIcon icon={faUser} className={StatsTasksCSS.userIcon}/>  said...
                </div>
                <div className={StatsTasksCSS.message}> {/* REPLACE BY REAL MESSAGE*/}
                    Hello User, for this week the assignments include:
                    <ul className={StatsTasksCSS.list}>
                    <li> Practice C major scales. We will have a look at it next week in class.</li>
                    <li>I am opening a submission task for "The Fireman", make s...</li>
                    </ul>
                </div>
                <div className={StatsTasksCSS.note}>
                    <FontAwesomeIcon icon={faTriangleExclamation} className={StatsTasksCSS.exclamationIcon} />
                     <div className={StatsTasksCSS.text}>2 submission assignments linked to this announcement</div> {/* REPLACE BY REAL number of assignments*/}
                    <FontAwesomeIcon icon={faTriangleExclamation} className={StatsTasksCSS.exclamationIcon} />
                </div>
            </div>
        </div>
    </div>
    </div>
  );
};

export default StatsTasksSection;