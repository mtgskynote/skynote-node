import React, { useEffect, useState, useRef } from "react";
import {createRoutesFromElements, useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AssignmentsCSS from './Assignments.module.css'
import { getAllAssignments, putAssignment, deleteAssignment } from "../utils/assignmentsMethods.js";
import {getMessages, putMessage} from "../utils/messagesMethods.js";
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
    faBookBookmark,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";
import PopUpWindowGrades from "./PopUpWindowGrades";
import PopUpWindowRecordings from "./PopUpWindowRecordings.js";
import Messages from "./messages.js";

const Assignments = (props) => {
    const navigate = useNavigate();
    const { getCurrentUser } = useAppContext();
    const [userData, setUserData] = useState(null);
    const [scoresData, setScoresData] = useState(null);
    const [userAnnouncements, setUsertAnnouncements] = useState(null);
    const [userChat, setUsertChat] = useState(null);
    const [popUpWindowGrade, setPopUpWindowGrade] = useState(false);
    const [popUpWindowRecordings, setPopUpWindowRecordings] = useState(false);
    const [taskComment, setTaskComment] = useState(null);
    const [taskGrade, setTaskGrade] = useState(null);
    const [selectedScore, setSelectedScore] = useState(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const chatInputRef = useRef();
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
    /* FOR NOW THIS CODE DOES NOT DISPLAY ANYTHING REAL */


    const fetchDataFromAPI = () => {

        getCurrentUser() // fetchData is already an async function
          .then((result) => {
            setUserData(result);
          }).catch((error) => {
            console.log(`getCurentUser() error: ${error}`)
            // Handle errors if necessary
          })
    
    };

    const handleSeeClick = (id, scoreXML)=> {
        navigate(`/ListRecordings/${scoreXML}`, {state:{'id':id}})
    }

    const handleRecord = (scoreXML)=> {
        navigate(`/all-lessons/${scoreXML}`);
    }

    const handleSeeGrades = (option, comment, grade)=> {
        if(option==="see"){
            setPopUpWindowGrade(true)
            setTaskComment(comment)
            setTaskGrade(grade)
        }else{
            setPopUpWindowGrade(false)
            setTaskComment(null)
            setTaskGrade(null)
        }
        
    }
    const handleSelectRecording = (option, scoreId, announcementId)=> {
        if(option==="open"){
            setPopUpWindowRecordings(true)
            setSelectedScore(scoreId)
            setSelectedAnnouncement(announcementId)
        }else{
            setPopUpWindowRecordings(false)
            setSelectedScore(null)
            setSelectedAnnouncement(null)
        }
    }
    const handleSend=()=>{
        // Update database
        const chatInputValue = chatInputRef.current.value;
        console.log('User Input in chat:', chatInputValue);
        if(chatInputValue!==""){
            console.log("send message")
            
            //Put message on DB
            putMessage(chatInputValue, userData.id, "5d34c59c098c00453a233bf3").then((message)=>{ //FIXME teacher ID
                //To not reload the page, add this message to userChat in state directly
                console.log("userChat ", userChat)
                const currentChat=userChat
                console.log(message)
                
                currentChat[Object.keys(currentChat).length]=
                    {
                        id:message._id,
                        message:message.content,
                        student:true,
                        date:new Date(message.timestamp).toLocaleDateString("es-ES", options),
                        teacher:message.teacher,
                        seen:message.seen,
                    }
            
                console.log("updated current Chat: ", currentChat)
                setUsertChat(currentChat)
                //Clear input chat box
                chatInputRef.current.value=""
            }) 
        }else{
            console.log("dont send message")
        }
    }
    
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
        if(userData!==null && scoresData!==null){
            //Assignments
            getAllAssignments(userData.id).then((result)=>{
                if(result.length!==0){
                    setUsertAnnouncements(result.reverse())}
            })
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
                            Posted on : {new Date(announcement.postDate).toLocaleDateString("es-ES", {year: "numeric",month: "numeric",day: "numeric",hour: "2-digit",minute: "2-digit",})}
                        </div>
                        <div> 
                            Due on : {new Date(announcement.dueDate).toLocaleDateString("es-ES", {year: "numeric",month: "numeric",day: "numeric",hour: "2-digit",minute: "2-digit",})}
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
                                                        <FontAwesomeIcon title="Go to recording assigned to this submission" icon={faEye} className={AssignmentsCSS.simpleIcon} onClick={() => handleSeeClick(task.answer.recordingId, current_score.fname)}/>
                                                        <FontAwesomeIcon title="See grade and comment" icon={faBookBookmark} className={AssignmentsCSS.simpleIcon} onClick={() => handleSeeGrades("see", task.answer.comment, task.answer.grade)} />
                                                    </div>
                                                    
                                                </div>:
                                                <div className={AssignmentsCSS.notSubmitted}> 
                                                    <div className={AssignmentsCSS.cursive}>Status: Not submitted</div>
                                                    <div className={AssignmentsCSS.buttonGroup}>
                                                        <FontAwesomeIcon title="Record for this submission" icon={faRecordVinyl} className={AssignmentsCSS.simpleIcon} onClick={() => handleRecord(current_score.fname)}/>
                                                        <FontAwesomeIcon title="Assign recording to this submission" icon={faFileImport} className={AssignmentsCSS.simpleIcon} onClick={() => handleSelectRecording("open", task.score, announcement._id)} />
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
            {userData!==null?<Messages user={userData.id} teacher="5d34c59c098c00453a233bf3"/>:<Messages/> /*FIXME*/} 
        </div>
        {popUpWindowGrade?<PopUpWindowGrades handlerBack={handleSeeGrades} comment={taskComment} grade={taskGrade}/>:""}
        {popUpWindowRecordings?<PopUpWindowRecordings handlerBack={handleSelectRecording} scoreId={selectedScore} userId={userData.id} announcementId={selectedAnnouncement}/>:""}

    </div>
  );
};

export default Assignments;