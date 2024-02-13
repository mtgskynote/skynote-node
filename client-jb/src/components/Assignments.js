import React, { useEffect, useState } from "react";
import {useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AssignmentsCSS from './Assignments.module.css'

import {
    faFileImport,
    faUser,
    faTriangleExclamation,
    faEye,
    faMusic,
    faPencilSquare,
    faBoxArchive,
    faRecordVinyl,
} from "@fortawesome/free-solid-svg-icons";

const Assignments = (props) => {
    const navigate = useNavigate();
    const { getCurrentUser } = useAppContext();
    const [userData, setUserData] = useState(null);
    const [scoresData, setScoresData] = useState(null);
    const [userAnnouncements, setUsertAnnouncements] = useState(null);

    /* FOR NOW THIS CODE DOES NOT DISPLAY ANYTHING REAL */

    // Assuming the following structure of Assingments database (or similar!):
    /* 
    {
        __id: /assignment id/
        teacher: /teacher id, who emitted it/
        student:{ 
                    /student(s) to which this assinment is directed/
                    0: student_id1
                    1: student_id2
                    ... (it can just be one student)
                }
        message: /text inside the assingment or announcement/
        tasks:{
                    /tasks associated with this announcement, that students should submit, this can be empty/
                    score_id1 /score to which this task is associated/:{
                        0: recordingId_answer1 /answer from student_id1, empty if there is no answer yet/
                        1: recordingId_answer2 /answer from student_id2, empty if there is no answer yet/
                    }
                    score_id2:{same}
                }
        post: /date when it was posted/
        due: /date limit/
    }
    */


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
      }, []); // Only once

    //get Tasks Data for this user
    useEffect(()=>{
        if(userData!==null && scoresData!==null){
            //Call database to get tasks info and do a .then with the processing below:
            //Example of structure extracted from database
            const assignments={
                0:{
                    id:"11111111",
                    teacher:"Anita",
                    student:{0:"645b6e484612a8ebe8525933", 1:"pepitogrillo"},
                    message:"Hello User, for this week the assignments include: Practice C major scales. We will have a look at it next week in class.I am opening a submission task for 'The Fireman', make sure you get all 3 stars!",
                    tasks:{
                        "64d0de60d9ac9a34a66b4d45":{"645b6e484612a8ebe8525933":"answerMe","pepitogrillo":"answerPepito"},
                    },
                    post:"date posted",
                    due:"date due",
                },
                1:{
                    id:"222222222",
                    teacher:"Anita",
                    student:{0:"645b6e484612a8ebe8525933"},
                    message:"No homework this week",
                    tasks:{},
                    post:"date posted",
                    due:"date due",
                },
                2:{
                    id:"333333333",
                    teacher:"Anita",
                    student:{0:"645b6e484612a8ebe8525933"},
                    message:"Hello, as this is Christmas week, look on the internet for a Christmas song and bring it to class on Monday! Also, submit the tasks below before due date!",
                    tasks:{
                        "64d0de60d9ac9a34a66b4d45":{"645b6e484612a8ebe8525933":"answerMe"},
                        "64d0de60d9ac9a34a66b4d47":{"645b6e484612a8ebe8525933":""},
                    },
                    post:"date posted",
                    due:"date due",
                },
            }
            const result=Object.values(assignments) //simulates what the database returns
            
            //.then()
            //Extract only information relevant for a specific user (actually we could create a callfunction that only retrieved that information)
            let myannouncements={}
            result.map((assignment,index)=>{
                //Firstly, extract only assignments that are directed to the current user
                const studentToCheck = userData.id;
                const isStudentPresent = Object.values(assignment.student).includes(studentToCheck);
                if (isStudentPresent) {
                    //current user has this announcement assigned
                    //now check for existing tasks and what scores they refer to
                    const tasks= assignment.tasks
                    const tasks_scores=Object.keys(tasks)
                    let mytasks={}
                    if(tasks_scores.length !== 0){
                        Object.values(tasks).map((task,index)=>{
                            const score = scoresData.find(item => item._id === tasks_scores[index])
                            //All answers associated to this task
                            const content_tasks= tasks[tasks_scores[index]]
                            // From that i just want the answers belonging to the current user
                            const currentUserAnswer=content_tasks[studentToCheck]
                            mytasks[index]={
                                score:score,
                                answer:currentUserAnswer,
                            }

                        })
                    }
                    // Add the announcement details to myannouncements
                    myannouncements[index] = {
                        announcement:assignment.id,
                        teacher:assignment.teacher, //at some point this should be the teachers name maybe?
                        message: assignment.message,
                        postDate: assignment.post,
                        dueDate: assignment.due,
                        tasks: mytasks
                    };
                     
                } else {
                    //current user does not have this announcement assigned, ignore
                }
                setUsertAnnouncements(myannouncements)
            })
            
            
            //Get teacher info, get message, get dates
            //Are there tasks? Show them
        }
      },[userData, scoresData])

  
  return (
    <div className={AssignmentsCSS.container}>
      <h4 className={AssignmentsCSS.title}>
        Teacher announcements
      </h4>
    {userAnnouncements!==null?
    Object.values(userAnnouncements).map((announcement,index)=>{
        return(
        <div className={AssignmentsCSS.tableBox}> 
        <div>
            <div className={AssignmentsCSS.header}> 
                <div> 
                    Posted on : {announcement.postDate} {/* REPLACE BY REAL DATE*/}
                </div>
                <div> 
                    Due on : {announcement.dueDate}{/* REPLACE BY REAL DATE*/}
                </div>
            </div>
            <div className={AssignmentsCSS.announcementBody}> 
                <div className={AssignmentsCSS.teacher}> 
                    {announcement.teacher}   <FontAwesomeIcon icon={faUser} className={AssignmentsCSS.userIcon}/>  said...
                </div>
                <div className={AssignmentsCSS.message}> {/* REPLACE BY REAL MESSAGE*/}
                    {announcement.message}
                </div>
                <div className={AssignmentsCSS.footNote}>
                    {Object.values(announcement.tasks).length!==0?
                    <div className={AssignmentsCSS.note}>

                    <FontAwesomeIcon icon={faTriangleExclamation} className={AssignmentsCSS.exclamationIcon} />
                    <div className={AssignmentsCSS.text}>{Object.values(announcement.tasks).length} submission assignment(s) linked to this announcement</div> {/* REPLACE BY REAL number of assignments*/}
                    <FontAwesomeIcon icon={faTriangleExclamation} className={AssignmentsCSS.exclamationIcon} />
                </div>:""
                    }
                    <div className={AssignmentsCSS.taskGroup}>
                        {Object.values(announcement.tasks).map((task, index)=>{
                            return(
                                <div className={AssignmentsCSS.taskItem}>
                                    <div className={AssignmentsCSS.taskHeader}>
                                        <div><h6>
                                        <FontAwesomeIcon icon={faMusic} className={AssignmentsCSS.simpleIcon}/>
                                        {task.score.title}
                                        </h6></div>
                                        <div><h6 >
                                            <FontAwesomeIcon icon={faPencilSquare} className={AssignmentsCSS.simpleIcon}/>
                                            {task.score.skill}
                                        </h6></div>
                                        <div><h6 >
                                            <FontAwesomeIcon icon={faBoxArchive} className={AssignmentsCSS.simpleIcon}/>
                                            Level {task.score.level}
                                        </h6></div>
                                    </div>
                                    <div>{task.answer.length!==0?
                                        <div className={AssignmentsCSS.submitted}> 
                                            <div className={AssignmentsCSS.cursive}>Status: Submitted</div>
                                            <FontAwesomeIcon title="Go to recording assigned to this submission" icon={faEye} className={AssignmentsCSS.simpleIcon} />
                                            
                                        </div>:
                                        <div className={AssignmentsCSS.notSubmitted}> 
                                            <div className={AssignmentsCSS.cursive}>Status: Not submitted</div>
                                            <div className={AssignmentsCSS.buttonGroup}>
                                                <FontAwesomeIcon title="Record for this submission" icon={faRecordVinyl} className={AssignmentsCSS.simpleIcon} />
                                                <FontAwesomeIcon title="Assign recording to this submission" icon={faFileImport} className={AssignmentsCSS.simpleIcon} />
                                            </div>
                                    </div>}
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
        </div>
        )
    }):<div>No announcements yet</div>}
    
    </div>
  );
};

export default Assignments;