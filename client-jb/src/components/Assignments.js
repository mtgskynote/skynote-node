import React, { useEffect, useState } from "react";
import {useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AssignmentsCSS from './Assignments.module.css'
import { getAllAssignments, putAssignment, deleteAssignment } from "../utils/assignmentsMethods.js";
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

    const handleSeeClick = (id, scoreXML)=> {
        console.log(id, scoreXML, "hola")
        navigate(`/ListRecordings/${scoreXML}`, {state:{'recordingID':id}})
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
                console.log("done", result)
                if(result.length!==0){
                    setUsertAnnouncements(result.reverse())}
            })
            /////////////
            const assignmentTest = {
                teacherId: "5d34c59c098c00453a233bf3",
                students: ["645b6e484612a8ebe8525933"],
                message:  "This one is just s test :)",
                post: "2024-01-21T11:08:37.398+00:00",
                due: "2024-01-31T11:08:37.398+00:00",
                tasks: [
                    {
                        score: "64d0de60d9ac9a34a66b4d45", 
                        answers:[
                            {
                                studentId: "645b6e484612a8ebe8525933",
                                recordingId: "65ba2a351ca9199e85e76bbe",
                                grade: 3.6,
                                comment: "This is the wrong song mate :(",
                            }
                            
                        ]
                    }   
                    
                ],
            }
            // getAllAssignments();
            // putAssignment(assignmentTest);
            // deleteAssignment("65cc93e4b60b63215a289108");
            const studentToCheck = userData.id;
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
                                                        <FontAwesomeIcon title="Go to recording assigned to this submission" icon={faEye} className={AssignmentsCSS.simpleIcon} onClick={() => handleSeeClick(task.answer.recordingId, current_score.fname)}/>
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