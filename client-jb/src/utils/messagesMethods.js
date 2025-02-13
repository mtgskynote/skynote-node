import axios from 'axios';

/**
 * Fetches messages between two users with an optional limit.
 * @param {string} user1 - The ID of the first user.
 * @param {string} user2 - The ID of the second user.
 * @param {number} [limit=12] - The maximum number of messages to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to an array of messages.
 */
async function getMessages(user1, user2, limit = 12) {
  try {
    const response = await axios.get('/api/v1/messages/getAllMessages', {
      params: { sender: user1, receiver: user2, limit: limit },
    });
    const messages = response.data.messages;
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

/**
 * Sends a message from one user to another.
 * @param {string} content - The content of the message.
 * @param {string} sender - The ID of the sender.
 * @param {string} receiver - The ID of the receiver.
 * @returns {Promise<Object|null>} - A promise that resolves to the new message data or null if the send failed.
 */
async function putMessage(content, sender, receiver) {
  try {
    const response = await axios.put('/api/v1/messages/putMessage', {
      content: content,
      sender: sender,
      receiver: receiver,
    });
    if (response.status === 201) {
      return response.data.newMessage;
    } else {
      console.log('putMessage failed!');
      return null;
    }
  } catch (error) {
    console.error('Error on axios putMessage', error);
  }
}

/**
 * Updates the seen status of messages between two users.
 * @param {string} user1 - The ID of the first user.
 * @param {string} user2 - The ID of the second user.
 * @returns {Promise<Object|null>} - A promise that resolves to the response data or null if the update failed.
 */
async function updateMessageSeen(user1, user2) {
  try {
    const response = await axios.put('/api/v1/messages/updateMessageSeen', {
      user1: user1,
      user2: user2,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.log('updateAssignment failed!');
      return null;
    }
  } catch (error) {
    console.error('Error on axios updateAssignment', error);
  }
}

export { getMessages, putMessage, updateMessageSeen };
