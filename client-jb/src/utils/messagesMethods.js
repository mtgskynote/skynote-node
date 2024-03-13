import axios from "axios";

async function getMessages(user1, user2, limit = 12) {
    try {
      const response = await axios.get("/api/v1/messages/getAllMessages", {params: {sender: user1, receiver: user2, limit:limit}});

      const messages = response.data.messages;
      //console.log(`getMessages response: ${JSON.stringify(response.data.messages)}`)
      return messages; // Return the retrieved messages
  
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error; // Re-throw the error for handling in your component
    }

  }



  async function putMessage(content, sender, receiver) {           
    try {
        
        const response = await axios.put('/api/v1/messages/putMessage', {
            "content": content,   //content
            "sender": sender,  //sender
            "receiver": receiver // receiver
          })
        //console.log(`response from putMessage was ${JSON.stringify(response.data)}`);
        if (response.status===201) { /* 201 is the status code for a successful PUT */
            // console.log('putMessage  returned OK')
            return response.data.newMessage; 
        } else {
            console.log('putMessage failed!')
            return null;
        }
    } catch (error) {
        console.error('Error on axios putMessage', error);
    }
}

async function updateMessageSeen(user1, user2) {           
  try {
      const response = await axios.put("/api/v1/messages/updateMessageSeen", {user1: user1, user2:user2});
      //console.log(`response from updateMessageSeen was ${JSON.stringify(response.data)}`);
      if (response.status===200) { /* 200 is the status code everything okay */
          // console.log('updateAssignment  returned OK')
          return response.data; 
      } else {
          console.log('updateAssignment failed!')
          return null;
      }
  } catch (error) {
      console.error('Error on axios updateAssignment', error);
  }
}


  export { getMessages, putMessage, updateMessageSeen };