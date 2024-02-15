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

const StatsTasksSection = () => {
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
        setAssignmentData(result[0])
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
    },[userData]);

    /* FOR NOW THIS CODE DOES NOT DISPLAY ANYTHING REAL */

    // Event handler for click on OPEN
  const handleOpen = ()=> {
    navigate(`/assignments/`)
  }

  // Define options for formatting date
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  
  if (assignmentData!==null){
    return (
      <div className={StatsTasksCSS.container}>
        <h4 className={StatsTasksCSS.title}>
          Latest announcement 
        </h4>
      <div className={StatsTasksCSS.tableBox}> 
          <div>
              <div className={StatsTasksCSS.header}> 
                  <div> 
                      Posted on : {new Date(assignmentData.post).toLocaleDateString("es-ES", options)}
                  </div>
                  <div> 
                      Due on : {new Date(assignmentData.due).toLocaleDateString("es-ES", options)}
                  </div>
                  <button className={StatsTasksCSS.openButton} onClick={() => handleOpen()}> 
                      OPEN <FontAwesomeIcon icon={faFileImport} className={StatsTasksCSS.openIcon} />
                  </button>
              </div>
              <div className={StatsTasksCSS.announcementBody}> 
                  <div className={StatsTasksCSS.teacher}> 
                      TEACHER   <FontAwesomeIcon icon={faUser} className={StatsTasksCSS.userIcon}/>  said...
                  </div>
                  <div className={StatsTasksCSS.message}> 
                    {assignmentData.message}
                  </div>
                  <div className={StatsTasksCSS.note}>
                      <FontAwesomeIcon icon={faTriangleExclamation} className={StatsTasksCSS.exclamationIcon} />
                       <div className={StatsTasksCSS.text}>{assignmentData.tasks.length} submission assignments linked to this announcement</div>
                      <FontAwesomeIcon icon={faTriangleExclamation} className={StatsTasksCSS.exclamationIcon} />
                  </div>
              </div>
          </div>
      </div>
      </div>
    );
  }
  
};

export default StatsTasksSection;