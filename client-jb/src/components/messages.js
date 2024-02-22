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
    const [aux, setAux] = useState(0);
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
        if(chatInputValue!==""){
            
            //Put message on DB
            putMessage(chatInputValue, userId, teacherId).then((message)=>{ 
                //To not reload the page, add this message to userChat in state directly
                const newMessage=
                    {
                        id:message._id,
                        message:message.content,
                        student:true,
                        date:new Date(message.timestamp).toLocaleDateString("es-ES", options),
                        teacher:message.teacher,
                        seen:message.seen,
                    }
                const currentChat=Object.values(userChat).reverse()
                currentChat[currentChat.length]=newMessage //add message
                //Update chat
                setUserChat(currentChat.reverse())
                //Clear input chat box
                chatInputRef.current.value=""
            }) 
        }else{
            // Nothing, no message is sent
        }
    }
    const handleKey=(event)=>{
        if (event.key === 'Enter') {
            handleSend();
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
                setUserChat(mychat)
                setAux(aux+1)
            }) 

        }

    }, [userId, teacherId])





  return (
    <div className={AssignmentsCSS.chatGroup}> 
                <div className={AssignmentsCSS.chatHeader}> 
                    <div className={AssignmentsCSS.teacher}> 
                        Your conversation with {teacherId}  <FontAwesomeIcon icon={faUser} className={AssignmentsCSS.userIcon}/>
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
                    <button className={AssignmentsCSS.button} onClick={() => handleSend()}><FontAwesomeIcon icon={faPaperPlane} className={AssignmentsCSS.sendIcon} />  </button>
                    <textarea 
                        type="text"
                        id="userInput"
                        placeholder="Type here..."
                        className={AssignmentsCSS.textInput} 
                        ref={chatInputRef}
                        onKeyUp={handleKey}
                    /> 
                    
                </div>
            </div>
    
  );
};

export default Messages;