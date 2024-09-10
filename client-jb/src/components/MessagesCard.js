import React, { useEffect, useState } from 'react';
import {
  getMessages,
  putMessage,
  updateMessageSeen,
} from '../utils/messagesMethods.js';
import Message from './Message.js';
import ButtonNoOutline from './ButtonNoOutline.js';

const MessagesCard = ({ user, teacher }) => {
  const [chat, setChat] = useState(null);
  const [aux, setAux] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const fetchChat = () => {
    let chat = {};
    getMessages(user.id, teacher.id)
      .then((messages) => {
        messages.forEach((message, index) => {
          const messageDate = new Date(message.timestamp).toLocaleDateString(
            'en-UK',
            options
          );
          if (message.sender === user.id) {
            // Student
            chat[index] = {
              messageId: message._id,
              messageContent: message.content,
              isStudent: true,
              messageDate: messageDate,
              associatedTeacher: message.teacher,
              isSeen: message.seen,
            };
          } else {
            // Teacher
            chat[index] = {
              messageId: message._id,
              messageContent: message.content,
              isStudent: false,
              messageDate: messageDate,
              associatedTeacher: message.teacher,
            };
          }
        });
        setChat(chat);
        setAux(aux + 1);
      })
      .catch((error) => {
        console.log(`error getting messages: ${error}`);
      });

    // Set all messages seen to true if a student opens the chat
    updateMessageSeen(user.id, teacher.id).catch((error) => {
      console.log(`error updating seen messages: ${error}`);
    });
  };

  const handleSend = () => {
    if (inputValue !== '') {
      putMessage(inputValue, user.id, teacher.id).then((message) => {
        const newMessage = {
          messageId: message._id,
          messageContent: message.content,
          isStudent: true,
          messageDate: new Date(message.timestamp).toLocaleDateString(
            'en-UK',
            options
          ),
          associatedTeacher: message.teacher,
          isSeen: message.seen,
        };
        const newChat = Object.values(chat).reverse();
        newChat[newChat.length] = newMessage;
        setChat(newChat.reverse());
        setInputValue('');
      });
    }
  };

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    if (user !== null && teacher !== null) {
      fetchChat();
    }
  }, [user, teacher]);

  return (
    <div className="bg-blue-200 shadow-lg rounded-2xl flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 mx-3">
          {chat !== null ? (
            Object.values(chat)
              .reverse()
              .map((message, index) => {
                const [date, time] = message.messageDate.split(', ');
                return (
                  <div key={index}>
                    {(index === 0 ||
                      date !==
                        Object.values(chat)
                          .reverse()
                          [index - 1].messageDate.split(', ')[0]) && (
                      <div className="text-center text-sm opacity-75 text-gray-500 mb-4">
                        {date}
                      </div>
                    )}
                    <Message
                      content={message.messageContent}
                      date={time}
                      seen={message.isSeen}
                      isCurrentUser={message.isStudent}
                    />
                  </div>
                );
              })
          ) : (
            <p className="text-lg text-black opacity-50 text-center">
              You have no messages.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center mt-4 border-t border-gray-300 pt-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none mr-2"
          onKeyUp={handleEnterKey}
        />

        <ButtonNoOutline
          handler={handleSend}
          text="Send"
          bgColor="blue-500"
          textColor="white"
          hoverBgColor="blue-600"
        />
      </div>
    </div>
  );
};

export default MessagesCard;
