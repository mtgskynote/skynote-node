import Message from "../models/Message.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import mongoose from 'mongoose';

/* see messageRoutes.js for the routes that use these functions */

const getAllMessages = async (req, res) => {
  console.log(`server getAllMessages `)
  const { sender, receiver, limit} = req.query;

  console.log(`sender: ${sender}, receiver: ${receiver}, limit: ${limit}`)

  // Validation (optional)
  if (!sender || !receiver) {
    return res.status(400).json({ error: 'Missing participant IDs' });
  }

  const pipeline = [
    {
      $match: {
        $or: [
          { sender: mongoose.Types.ObjectId(sender), receiver: mongoose.Types.ObjectId(receiver) },
          { sender: mongoose.Types.ObjectId(receiver), receiver: mongoose.Types.ObjectId(sender) },
        ],
      },
    },
    {
      $sort: { createdAt: 1 }, // Sort by date ascending
    },
    /* {
      $skip: parseInt(skip) || 0, // Skip documents for pagination
    }, */
    {
      $limit: parseInt(limit) || 10, // Limit documents per page
    },
  ];

  try {
    const messages = await Message.aggregate(pipeline);
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



  const getAllMessages_old = async (req, res) => {
    const { sender, receiver, limit, skip } = req.query; // Optional parameters
  
    try {
      // Create query based on provided filters
      const query = {};
      if (sender) {
        query.sender = sender;
      }
      if (receiver) {
        query.receiver = { $in: [receiver] }; // Check if receiver is in the array
      }
  
      // Add pagination options (optional)
      const options = {
        limit: limit || 10, // Default limit
        skip: skip || 0, // Default skip
        sort: { _id: -1 }, // Sort by latest first
      };
  
      // Retrieve messages with filtering and pagination
      const messages = await Message.find(query, null, options);
  
      // Send response with message details
      res.status(200).json({ messages });
    } catch (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ error: 'Error getting messages' });
    }
  }

  
  const putMessage = async (req, res) => {
    console.log(`server putMessage starting`)
      const { content, sender, receiver } = req.body; // Validate and sanitize data

      console.log(`content: ${content}, sender: ${sender}, receiver: ${receiver} `)

      try {
        // ... (message validation logic)
        // Check if receiver is a valid MongoDB ID
        console.log('check reciever validity')
        if (!mongoose.Types.ObjectId.isValid(receiver)) {
          throw new Error('Invalid receiver ID format');
        }
        // ... (rest of the logic)
      } catch (error) {
        res.status(400).json({ "error": error.message }); // Send specific error message
      }

      console.log(`server putMessage - about to call new Message`)
    
      try {
        // Check user authorization and message validity (if applicable)
    
        // Create a new message document
        const newMessage = new Message({ content, sender, receiver });
        await newMessage.save();
    
        console.log(`server putMessage - return status `)

        // Send response with the saved message details
        res.status(201).json({ newMessage });
      } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Error uploading message' });
      }
    }

  

export { putMessage, getAllMessages };