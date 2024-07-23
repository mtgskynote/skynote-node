import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext.js';
import axios from 'axios';
import { timer } from './SessionTimer.js';
import PopUpWindowAssignments from './PopUpWindowAssignments';
import PopUpWindowGrading from './PopUpWindowGrading';

/*
The useEffect hook runs once when the component mounts ([] as a dependency means it runs only once).
Inside useEffect, an asynchronous operation (fetching data in this case) is performed.

This might be overkill for grabbing the user's email, but it's a good pattern to follow for more complex data fetching from the server.
*/

const Apitesting = () => {
  const [data, setData] = useState(null);

  const toggletimer = () => {
    if (timer.isRunning) {
      timer.pause();
    } else {
      timer.start();
    }
  };

  const { getCurrentUser } = useAppContext();

  // First we get the user info into "data" when the page loads so it can be used for sending/receiving messages.
  useEffect(() => {
    const fetchDataFromAPI = () => {
      console.log(`in fetchDataFromAPI, about to call getCurrentUser()`);
      getCurrentUser() // fetchData is already an async function
        .then((result) => {
          console.log(
            `getCurrentUser() has returned this result: ${JSON.stringify(
              result
            )}`
          );
          setData(result);
        })
        .catch((error) => {
          console.log(`getCurrentUser() error: ${error}`);
          // Handle errors if necessary
        });
    };
    fetchDataFromAPI();
  }, []);
  //===========================================================================
  const [popUpWindowAssignment, setPopUpWindowAssignment] = useState(false);
  const createTask = (option) => {
    if (option === 'see') {
      setPopUpWindowAssignment(true);
    } else {
      setPopUpWindowAssignment(false);
    }
  };
  const [popUpWindowGrading, setPopUpWindowGrading] = useState(false);
  const gradeTask = (option) => {
    if (option === 'see') {
      setPopUpWindowGrading(true);
    } else {
      setPopUpWindowGrading(false);
    }
  };

  //===========================================================================

  const postMessage = async (
    content = 'Message sent from the postMessage button'
  ) => {
    try {
      console.log(`postMessage from client, userId: ${data.id} `);
      const response = await axios.put('/api/v1/messages/putMessage', {
        content: content, //content
        sender: data.id, //sender
        receiver: '5d34c59c098c00453a233bf3', // receiver Teacher Stella Bella's id
      });
      console.log(`postMessage response: ${JSON.stringify(response)}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('Validation error:', error.response.data.error);
      } else console.log('Error posting message:', error);
    }
  };

  async function getMessages(limit = 12) {
    try {
      var url = new URL(
        '/api/v1/messages/getAllMessages',
        window.location.origin
      );

      // Add query parameters with renamed keys:
      // for getMessages, it doesn't matter who is the sender and who is the reciever
      url.searchParams.set('sender', data.id);
      url.searchParams.set('receiver', '5d34c59c098c00453a233bf3');
      url.searchParams.set('sort', '-createdAt'); // Sort descending by date
      url.searchParams.set('limit', limit);

      const response = await axios.get(url);

      const messages = response.data.messages;
      console.log(
        `getMessages response: ${JSON.stringify(response.data.messages)}`
      );
      return messages; // Return the retrieved messages
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error; // Re-throw the error for handling in your component
    }
  }

  //===========================================================================

  /*------------ Return the component! ----------*/
  return (
    <div>
      <div align="center">
        <h1>Skynote Profile</h1>
        <div align="center">
          <div>
            <div>
              <button onClick={toggletimer}>toggletimer</button>
            </div>
            <div>
              <button onClick={() => createTask('see')}>Create task</button>
              {popUpWindowAssignment ? (
                <PopUpWindowAssignments handlerBack={createTask} />
              ) : (
                ''
              )}
            </div>
            <div>
              <button onClick={() => gradeTask('see')}>Grade task</button>
              {popUpWindowGrading ? (
                <PopUpWindowGrading handlerBack={gradeTask} />
              ) : (
                ''
              )}
            </div>
            <div>
              <button onClick={() => postMessage('Your message here')}>
                postMessage
              </button>
            </div>
            <div>
              <button onClick={getMessages}>getMessages</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apitesting;
