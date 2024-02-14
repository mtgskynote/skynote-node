import React, { useEffect, useState } from "react";
import {useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AssignmentsCSS from './Assignments.module.css'
import { getAllAssignments } from "../utils/assignmentsMethods";

import {
    faFileImport,
    faUser,
    faTriangleExclamation,
    faEye,
    faMusic,
    faPencilSquare,
    faBoxArchive,
    faRecordVinyl,
    faPaperPlane,
    faBookBookmark
} from "@fortawesome/free-solid-svg-icons";

const Assignments = (props) => {
    const navigate = useNavigate();
    const { getCurrentUser } = useAppContext();
    const [userData, setUserData] = useState(null);
    const [scoresData, setScoresData] = useState(null);
    const [userAnnouncements, setUsertAnnouncements] = useState(null);
    const [userChat, setUsertChat] = useState(null);
    /* FOR NOW THIS CODE DOES NOT DISPLAY ANYTHING REAL */

    console.log("holaaa ", userAnnouncements)

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
    },[])
    
    //get Scores data
    useEffect(() => {
        // import local data
        const local= JSON.parse(localStorage.getItem("scoreData"));
        // save in state
        setScoresData(local);
      }, []); // Only once

    
    useEffect(()=>{
        console.log(userData, scoresData)
        if(userData!==null && scoresData!==null){
            getAllAssignments(userData.id).then((result)=>{
                console.log("done", result)
                if(result.length!==0){
                    setUsertAnnouncements(result.reverse())}
                
            })
            const studentToCheck = userData.id;
            //get Tasks Data for this user/////////////////////////////////////////////
            //Call database to get tasks info and do a .then with the processing below:
            /*
            0:{
                    id:"11111111",
                    teacher:"Anita",
                    student:{0:"645b6e484612a8ebe8525933", 1:"pepitogrillo"},
                    message:"Hello User, for this week the assignments include: Practice C major scales. We will have a look at it next week in class.I am opening a submission task for 'The Fireman', make sure you get all 3 stars!",
                    tasks:{
                        0: {score:"64d0de60d9ac9a34a66b4d45",
                            answers:{
                                        0:{studentId:"645b6e484612a8ebe8525933", recordingID:"recordingId",grade:"9",comment:"very good"},
                                        1:{studentId:"pepitogrillo", recordingID:"recordingId",grade:"8",teacherComment:"good"}
                            }
                    },
                    post:"date posted",
                    due:"date due",
                },
            */
            //Example of structure extracted from database
            /* const assignments={
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
            console.log(result)
            //.then()
            //Extract only information relevant for a specific user (actually we could create a callfunction that only retrieved that information)
            let myannouncements={}
            const studentToCheck = userData.id;
            result.map((assignment,index)=>{
                //Firstly, extract only assignments that are directed to the current user
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
            })*/
            //////////////////////////////////////////////////////////////////////////
            
            
            //get Chat Data for this user/////////////////////////////////////////////
            /*Data base should return messages like:
            db.messages.find({
                $or: [
                    { sender: teacherId, receiver: studentId },
                    { sender: studentId, receiver: teacherId }
                ]
                }).sort({ timestamp: 1 });
            */
            const messages={
                0:{
                    _id:"message1",
                    sender:"645b6e484612a8ebe8525933",
                    receiver:"Anita",
                    content:"Okay, I see, thank you!",
                    date:"date"
                },
                1:{
                    _id:"message2",
                    sender:"Anita",
                    receiver:"645b6e484612a8ebe8525933",
                    content:"You just have to practice at home, in class we will go through it all over again",
                    date:"date"
                },
                2:{
                    _id:"message4",
                    sender:"645b6e484612a8ebe8525933",
                    receiver:"Anita",
                    content:"I need help with my assignment. I was working all night and I couldnt understand, What do we have to do exactly?",
                    date:"date"
                },
                3:{
                    _id:"message4",
                    sender:"645b6e484612a8ebe8525933",
                    receiver:"Anita",
                    content:"I need help with my assignment. I was working all night and I couldnt understand, What do we have to do exactly?",
                    date:"date"
                },
                4:{
                    _id:"message4",
                    sender:"645b6e484612a8ebe8525933",
                    receiver:"Anita",
                    content:"When is the submission date?",
                    date:"date"
                },
                5:{
                    _id:"message2",
                    sender:"Anita",
                    receiver:"645b6e484612a8ebe8525933",
                    content:"hello you are the bestttt",
                    date:"date"
                },
                6:{
                    _id:"message2",
                    sender:"Anita",
                    receiver:"645b6e484612a8ebe8525933",
                    content:"good luck",
                    date:"date"
                },
                7:{
                    _id:"message4",
                    sender:"645b6e484612a8ebe8525933",
                    receiver:"Anita",
                    content:"I need help with my assignment. I was working all night and I couldnt understand, What do we have to do exactly?",
                    date:"date"
                },
                8:{
                    _id:"message2",
                    sender:"Anita",
                    receiver:"645b6e484612a8ebe8525933",
                    content:"hello you are the bestttt",
                    date:"date"
                },
            }
            const messages2=Object.values(messages)
            let mychat={}
            messages2.map((message,index)=>{
                console.log(message)
                if(message.sender===studentToCheck){
                    //My message
                    mychat[index]={
                        id:message._id,
                        message:message.content,
                        student:true,
                        date:message.date,
                        teacher:message.teacher,
                    }
                }else{
                    //Teacher message
                    mychat[index]={
                        id:message._id,
                        message:message.content,
                        student:false,
                        date:message.date,
                        teacher:message.teacher,
                    }
                }
            })
            console.log("chat ", mychat)
            setUsertChat(mychat)
            //////////////////////////////////////////////////////////////////////////
        }
      },[userData, scoresData])

  
  return (
    <div className={AssignmentsCSS.container}>
      
        <div className={AssignmentsCSS.left} >
            {userAnnouncements!==null?
            userAnnouncements.map((announcement,index)=>{
                return(
                <div className={AssignmentsCSS.tableBox}> 
                <div>
                    <div className={AssignmentsCSS.header}> 
                    {
                        
                    }
                        <div> 
                            Posted on : {new Date(announcement.postDate).toLocaleDateString("es-ES", {year: "numeric",month: "numeric",day: "numeric",hour: "2-digit",minute: "2-digit",second: "2-digit",})}
                        </div>
                        <div> 
                            Due on : {new Date(announcement.dueDate).toLocaleDateString("es-ES", {year: "numeric",month: "numeric",day: "numeric",hour: "2-digit",minute: "2-digit",second: "2-digit",})}
                        </div>
                    </div>
                    <div className={AssignmentsCSS.announcementBody}> 
                        <div className={AssignmentsCSS.teacher}> 
                            {announcement.teacher}   <FontAwesomeIcon icon={faUser} className={AssignmentsCSS.userIcon}/>  said...
                        </div>
                        <div className={AssignmentsCSS.message}> 
                            {announcement.message}
                        </div>
                        <div className={AssignmentsCSS.footNote}>
                            {announcement.tasks?
                            <div className={AssignmentsCSS.note}>

                            <FontAwesomeIcon icon={faTriangleExclamation} className={AssignmentsCSS.exclamationIcon} />
                            <div className={AssignmentsCSS.text}>{announcement.tasks.length} submission assignment(s) linked to this announcement</div>
                            <FontAwesomeIcon icon={faTriangleExclamation} className={AssignmentsCSS.exclamationIcon} />
                        </div>:""
                            }
                            <div className={AssignmentsCSS.taskGroup}>
                                {announcement.tasks.map((task, index)=>{
                                    var current_score=scoresData.find(item => item._id === task.score)
                                    return(
                                        <div className={AssignmentsCSS.taskItem}>
                                            <div className={AssignmentsCSS.taskHeader}>
                                                <div><h6>
                                                <FontAwesomeIcon icon={faMusic} className={AssignmentsCSS.simpleIcon}/>
                                                {current_score.title}
                                                </h6></div>
                                                <div><h6 >
                                                    <FontAwesomeIcon icon={faPencilSquare} className={AssignmentsCSS.simpleIcon}/>
                                                    {current_score.skill}
                                                </h6></div>
                                                <div><h6 >
                                                    <FontAwesomeIcon icon={faBoxArchive} className={AssignmentsCSS.simpleIcon}/>
                                                    Level {current_score.level}
                                                </h6></div>
                                            </div>
                                            <div>{task.answer?
                                                <div className={AssignmentsCSS.submitted}> 
                                                    <div className={AssignmentsCSS.cursive}>Status: Submitted</div>
                                                    <div className={AssignmentsCSS.buttonGroup}>
                                                        <FontAwesomeIcon title="Go to recording assigned to this submission" icon={faEye} className={AssignmentsCSS.simpleIcon} />
                                                        <FontAwesomeIcon title="See grade and comment" icon={faBookBookmark} className={AssignmentsCSS.simpleIcon} />
                                                    </div>
                                                    
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
        <div className={AssignmentsCSS.right}>
            <div className={AssignmentsCSS.chatGroup}> 
                <div className={AssignmentsCSS.chatHeader}> 
                    <div className={AssignmentsCSS.teacher}> 
                        Your conversation with Anita   <FontAwesomeIcon icon={faUser} className={AssignmentsCSS.userIcon}/>
                    </div>
                </div>
                <div className={AssignmentsCSS.chat}>
                    {userChat!==null?
                    Object.values(userChat).map((message,index)=>{
                        return(
                            message.student?
                                <div className={AssignmentsCSS.chatItemStudent}>
                                    {message.message}
                                    <div className={AssignmentsCSS.chatItemDate}>
                                        {message.date}
                                    </div>
                                </div>:
                                <div className={AssignmentsCSS.chatItemTeacher}>
                                    {message.message}
                                    <div className={AssignmentsCSS.chatItemDate}>
                                        {message.date}
                                    </div>
                                </div>

                            
                            
                        )
                    }):
                    <div>No messages yet</div>
                    
                    
                    }
                </div>
                <div className={AssignmentsCSS.textGroup}>
                    <button className={AssignmentsCSS.button}><FontAwesomeIcon icon={faPaperPlane} className={AssignmentsCSS.sendIcon}/> </button>
                    <textarea 
                        type="text"
                        id="userInput"
                        placeholder="Type here..."
                        className={AssignmentsCSS.textInput} 
                    /> 
                    
                </div>
            </div>
        </div>
    </div>
  );
};

export default Assignments;