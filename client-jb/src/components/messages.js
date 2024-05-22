import React, { useEffect, useState, useRef } from "react";
import AssignmentsCSS from "./Assignments.module.css";
import {
  getMessages,
  putMessage,
  updateMessageSeen,
} from "../utils/messagesMethods.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPaperPlane,
  faCheck,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

const Messages = (props) => {
  const [user, setUser] = useState(null);
  const [teacher, setTeacher] = useState(null);
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

  const fetchChat = () => {
    let mychat = {};
    // get chat messages to display
    getMessages(user.id, teacher.id)
      .then((result) => {
        const messages = result;
        messages.forEach((message, index) => {
          if (message.sender === user.id) {
            //My message
            mychat[index] = {
              id: message._id,
              message: message.content,
              student: true,
              date: new Date(message.timestamp).toLocaleDateString(
                "es-ES",
                options
              ),
              teacher: message.teacher,
              seen: message.seen,
            };
          } else {
            //Teacher message
            mychat[index] = {
              id: message._id,
              message: message.content,
              student: false,
              date: new Date(message.timestamp).toLocaleDateString(
                "es-ES",
                options
              ),
              teacher: message.teacher,
            };
          }
        });
        setUserChat(mychat);
        setAux(aux + 1);
      })
      .catch((error) => {
        console.log(`getMessages() error: ${error}`);
      });

    // set to seen=true all messages sent by teacher to current student
    //(if student opens the chat we understand that they read all the messages)
    updateMessageSeen(user.id, teacher.id).catch((error) => {
      console.log(`updateMessageSeen() error: ${error}`);
      // Handle errors if necessary
    });
  };

  const handleSend = () => {
    // Update database
    const chatInputValue = chatInputRef.current.value;
    if (chatInputValue !== "") {
      //Put message on DB
      putMessage(chatInputValue, user.id, teacher.id).then((message) => {
        //To not reload the page, add this message to userChat in state directly
        const newMessage = {
          id: message._id,
          message: message.content,
          student: true,
          date: new Date(message.timestamp).toLocaleDateString(
            "es-ES",
            options
          ),
          teacher: message.teacher,
          seen: message.seen,
        };
        const currentChat = Object.values(userChat).reverse();
        currentChat[currentChat.length] = newMessage; //add message
        //Update chat
        setUserChat(currentChat.reverse());
        //Clear input chat box
        chatInputRef.current.value = "";
      });
    } else {
      // Nothing, no message is sent
    }
  };

  const handleReload = () => {
    fetchChat();
  };

  const handleKey = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (
      props.user !== null &&
      props.user !== undefined &&
      props.teacher !== null &&
      props.teacher !== undefined
    ) {
      setUser(props.user);
      setTeacher(props.teacher);
    }
  }, [props]);

  useEffect(() => {
    if (user !== null && teacher !== null) {
      fetchChat();
    }
  }, [user, teacher]);

  return (
    <div className={AssignmentsCSS.chatGroup}>
      {user !== null && teacher !== null ? (
        <div>
          <div className={AssignmentsCSS.chatHeader}>
            <div className={AssignmentsCSS.teacher}>
              Your conversation with {teacher.name}{" "}
              <FontAwesomeIcon
                icon={faUser}
                className={AssignmentsCSS.userIcon}
              />
            </div>
          </div>
          <div className={AssignmentsCSS.chat}>
            {userChat !== null ? (
              Object.values(userChat).map((message, index) => {
                return message.student ? (
                  <div className={AssignmentsCSS.chatItemStudent}>
                    {message.message}
                    <div className={AssignmentsCSS.chatItemDate}>
                      {message.date}
                      {message.seen ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={AssignmentsCSS.seenIcon}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={AssignmentsCSS.chatItemTeacher}>
                    {message.message}
                    <div className={AssignmentsCSS.chatItemDate}>
                      {message.date}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No messages yet</div>
            )}
          </div>
          <div className={AssignmentsCSS.textGroup}>
            <div className={AssignmentsCSS.buttonGroup}>
              <button
                title="reload chat"
                className={AssignmentsCSS.button}
                onClick={() => handleReload()}
              >
                <FontAwesomeIcon
                  icon={faArrowRotateLeft}
                  className={AssignmentsCSS.sendIcon}
                />{" "}
              </button>
              <button
                title="send"
                className={AssignmentsCSS.button}
                onClick={() => handleSend()}
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className={AssignmentsCSS.sendIcon}
                />{" "}
              </button>
            </div>
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
      ) : (
        ""
      )}
    </div>
  );
};

export default Messages;
