import axios from "axios";

async function getMessages(user1, user2, limit = 12) {
    try {
      const response = await axios.get("/api/v1/messages/getAllMessages", {params: {sender: user1, receiver: user2, limit:limit}});

      const messages = response.data.messages;
      console.log(`getMessages response: ${JSON.stringify(response.data.messages)}`)
      return messages; // Return the retrieved messages
  
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error; // Re-throw the error for handling in your component
    }

  }

  export { getMessages};