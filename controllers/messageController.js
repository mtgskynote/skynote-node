import Message from '../models/Message.js';
import mongoose from 'mongoose';

/* see messageRoutes.js for the routes that use these functions */

const getAllMessages = async (req, res) => {
  console.log(`server getAllMessages `);
  const { sender, receiver, limit } = req.query;

  console.log(`sender: ${sender}, receiver: ${receiver}, limit: ${limit}`);

  // Validation (optional)
  if (!sender || !receiver) {
    return res.status(400).json({ error: 'Missing participant IDs' });
  }

  const pipeline = [
    {
      $match: {
        $or: [
          {
            sender: mongoose.Types.ObjectId(sender),
            receiver: mongoose.Types.ObjectId(receiver),
          },
          {
            sender: mongoose.Types.ObjectId(receiver),
            receiver: mongoose.Types.ObjectId(sender),
          },
        ],
      },
    },
    {
      $sort: { timestamp: -1 }, // Sort by date descending
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

const putMessage = async (req, res) => {
  console.log(`server putMessage starting`);
  const { content, sender, receiver } = req.body; // Validate and sanitize data

  console.log(`content: ${content}, sender: ${sender}, receiver: ${receiver} `);

  try {
    // ... (message validation logic)
    // Check if receiver is a valid MongoDB ID
    console.log('check reciever validity');
    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      throw new Error('Invalid receiver ID format');
    }
    // ... (rest of the logic)
  } catch (error) {
    res.status(400).json({ error: error.message }); // Send specific error message
  }

  console.log(`server putMessage - about to call new Message`);

  try {
    // Check user authorization and message validity (if applicable)

    // Create a new message document
    const newMessage = new Message({ content, sender, receiver });
    await newMessage.save();

    console.log(`server putMessage - return status `);

    // Send response with the saved message details
    res.status(201).json({ newMessage });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Error uploading message' });
  }
};

const updateMessageSeen = async (req, res) => {
  const user1Id = req.body.user1;
  const user2Id = req.body.user2;
  try {
    let updatedMessage = await Message.updateMany(
      {
        sender: mongoose.Types.ObjectId(user2Id),
        receiver: mongoose.Types.ObjectId(user1Id),
      },
      {
        $set: { seen: true },
      }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { putMessage, getAllMessages, updateMessageSeen };
