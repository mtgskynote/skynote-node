import User from '../models/User.js';
import xmlScores from '../models/xmlScoreModel.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import mongoose from 'mongoose';

// Update user email and name when editing the profile
const updateProfileData = async (req, res) => {
  console.log('updateProfileData req.body', req.body);
  const { email, name, lastName, instrument } = req.body;

  if (!email || !name) {
    throw new BadRequestError('Please provide at least name and email');
  }

  try {
    const user = await User.findOne({ _id: req.user.userId });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.instrument = instrument;

    await user.save();

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
      success: true,
      user,
      token,
      location: user.location,
      message: 'Document updated successfully',
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error updating user',
    });
  }
};

// Change user password
const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({ _id: req.user.userId });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update user's password
    user.password = newPassword; // Assign the new password
    await user.save(); // Save the user document

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error changing password',
    });
  }
};

const addFavourite = async (req, res) => {
  try {
    const { userId, songId } = req.params;
    const user = await User.findById(userId);

    console.log(`Adding favourite: userId=${userId}, songId=${songId}`);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFavourite = user.favourites.some((fav) =>
      fav.songId.equals(songId)
    );
    if (isFavourite) {
      return res.status(400).json({ message: 'Song already in favourites' });
    }

    user.favourites.push({ songId: mongoose.Types.ObjectId(songId) });
    await user.save();

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Error adding favourite:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const removeFavourite = async (req, res) => {
  try {
    const { userId, songId } = req.params;
    const user = await User.findById(userId);

    console.log(`Removing favourite: userId=${userId}, songId=${songId}`);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favourites = user.favourites.filter(
      (fav) => !fav.songId.equals(songId)
    );
    await user.save();

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Error removing favourite:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const uploadXMLFile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { skill } = req.body; // Extract skill from request body
    const file = req.file; // Get the file from the request

    console.log(`Adding XML file upload: userId=${userId}`);

    if (!file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'No file uploaded.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    // Create a new XML score object
    const newScore = new xmlScores({
      fname: file.originalname,
      level: 0, // Fixed level value for uploaded scores
      skill: skill || '', // Use provided skill or empty string
    });

    // Push the new score into the uploadedScores array
    user.uploadedScores.push(newScore);

    // Save the updated user document
    await user.save();

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Error uploading XML file to database:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const removeXMLFile = async (req, res) => {
  try {
    const { userId, songId } = req.params;

    console.log(`Removing XML file upload: userId=${userId}, songId=${songId}`);

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    // Find the index of the score to remove
    const scoreIndex = user.uploadedScores.findIndex(
      (score) => score._id.toString() === songId
    );

    if (scoreIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Score not found' });
    }

    // Remove the score from the uploadedScores array
    user.uploadedScores.splice(scoreIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Error removing XML file from user:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Endpoint handler to update recordingsPastWeek
const updateRecordingsPastWeek = async (req, res) => {
  const userId = req.params.userId;

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: `User with ID ${userId} not found` });
    }

    // Update recordingsPastWeek (increment the last element)
    const lastIndex = user.recordingsPastWeek.length - 1;
    user.recordingsPastWeek[lastIndex] += 1;
    await user.save();

    console.log(`Successfully updated recordings for user with ID ${userId}`);
    return res.status(200).json({ message: 'Recordings updated successfully' });
  } catch (error) {
    console.error(
      `Error updating recordings for user with ID ${userId}:`,
      error
    );
    return res
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
};

export {
  changePassword,
  updateProfileData,
  addFavourite,
  removeFavourite,
  uploadXMLFile,
  removeXMLFile,
  updateRecordingsPastWeek,
};
