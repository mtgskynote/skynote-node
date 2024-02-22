import React, { useEffect, useState, useRef} from 'react';
import AssignmentsCSS from './Assignments.module.css'
import {getMessages, putMessage} from "../utils/messagesMethods.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faPaperPlane,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";

const Messages = (props) => {
    const [userId, setUserId] = useState(null);
    const [teacherId, setTeacherId] = useState(null);
    const [userChat, setUserChat] = useState(null);
    const chatInputRef = useRef();
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
    const handleSend=()=>{
        // Update database
        const chatInputValue = chatInputRef.current.value;
        console.log('User Input in chat:', chatInputValue);
        if(chatInputValue!==""){
            console.log("send message")
            
            //Put message on DB
            putMessage(chatInputValue, userId, teacherId).then((message)=>{ //FIXME teacher ID
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
                setUserChat(currentChat)
                //Clear input chat box
                chatInputRef.current.value=""
            }) 
        }else{
            console.log("dont send message")
        }
    }

    useEffect(()=>{
        if(props.user!==null && props.user!==undefined && props.teacher!==null && props.teacher!==undefined ){
            setUserId(props.user)
            setTeacherId(props.teacher)
            
        }

    },[props])

    useEffect(()=>{
        if(userId!==null && teacherId!==null){
            let mychat={}
            
            getMessages(userId, teacherId).then((result)=>{ 
                const messages=result
                //console.log("Messages from database ", messages);
                messages.map((message,index)=>{
                    if(message.sender===userId){
                        //My message
                        mychat[index]={
                            id:message._id,
                            message:message.content,
                            student:true,
                            date:new Date(message.timestamp).toLocaleDateString("es-ES", options),
                            teacher:message.teacher,
                            seen:message.seen,
                        }
                    }else{
                        //Teacher message
                        mychat[index]={
                            id:message._id,
                            message:message.content,
                            student:false,
                            date:new Date(message.timestamp).toLocaleDateString("es-ES", options),
                            teacher:message.teacher,
                            
                        }
                    }
                })
                console.log(mychat) 
                setUserChat(mychat)
            }) 

        }

    }, [userId, teacherId])



  return (
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
                                        {message.seen?<FontAwesomeIcon icon={faCheck} className={AssignmentsCSS.seenIcon}/>:""}
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
                    <button className={AssignmentsCSS.button}><FontAwesomeIcon icon={faPaperPlane} className={AssignmentsCSS.sendIcon} onClick={() => handleSend()}/>  </button>
                    <textarea 
                        type="text"
                        id="userInput"
                        placeholder="Type here..."
                        className={AssignmentsCSS.textInput} 
                        ref={chatInputRef}
                    /> 
                    
                </div>
            </div>
    
  );
};

export default Messages;