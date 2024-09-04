import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext.js';
import axios from 'axios';
import { timer } from './SessionTimer.js';
import PopUpWindowAssignments from './PopUpWindowAssignments.js';
import PopUpWindowGrading from './PopUpWindowGrading.js';

/**
 * The ApiTesting component provides a UI for testing various API interactions.
 *
 * State:
 * - data (object|null): Stores user data fetched from the API.
 * - popUpWindowAssignment (boolean): Controls the visibility of the assignment creation popup.
 * - popUpWindowGrading (boolean): Controls the visibility of the assignment grading popup.
 *
 * The component:
 * - Toggles a timer using the toggleTimer function.
 * - Fetches user data on initial render using useEffect.
 * - Handles assignment creation and grading with createTask and gradeTask functions.
 * - Sends messages using the postMessage function.
 * - Retrieves messages using the getMessages function.
 */
const ApiTesting = () => {
  const [data, setData] = useState(null);
  const [popUpWindowAssignment, setPopUpWindowAssignment] = useState(false);
  const [popUpWindowGrading, setPopUpWindowGrading] = useState(false);

  const { getCurrentUser } = useAppContext();

  // Handle timer start and stop events
  const toggleTimer = () => {
    if (timer.isRunning) {
      timer.pause();
    } else {
      timer.start();
    }
  };

  // Fetch user data on first page load to use for sending and receiving messages
  useEffect(() => {
    const fetchDataFromAPI = () => {
      console.log(`in fetchDataFromAPI, about to call getCurrentUser`);
      getCurrentUser()
        .then((result) => {
          console.log(`getCurrentUser result: ${JSON.stringify(result)}`);
          setData(result);
        })
        .catch((error) => {
          console.log(`getCurrentUser error: ${error}`);
        });
    };
    fetchDataFromAPI();
  }, []);

  // Handle assignment creation
  const createTask = (option) => {
    if (option === 'see') {
      setPopUpWindowAssignment(true);
    } else {
      setPopUpWindowAssignment(false);
    }
  };

  // Handle assignment grading
  const gradeTask = (option) => {
    if (option === 'see') {
      setPopUpWindowGrading(true);
    } else {
      setPopUpWindowGrading(false);
    }
  };

  // Handle sending messages
  const postMessage = async (
    content = 'Message sent from the postMessage button'
  ) => {
    try {
      console.log(`post message from client, userId: ${data.id} `);
      const response = await axios.put('/api/v1/messages/putMessage', {
        content: content,
        sender: data.id,
        receiver: '5d34c59c098c00453a233bf3', // ID for teacher Stella Bella
      });
      console.log(`post message response: ${JSON.stringify(response)}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('Validation error:', error.response.data.error);
      } else console.log('Error posting message:', error);
    }
  };

  // Handle getting messages
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

  return (
    <div>
      <div>
        <h1>Skynote Profile - Testing</h1>
        <div>
          <div>
            <div>
              <button onClick={toggleTimer}>Toggle Timer</button>
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
                Post Message
              </button>
            </div>
            <div>
              <button onClick={getMessages}>Get Messages</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTesting;
