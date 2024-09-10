import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import mongoose from 'mongoose';
import path from 'path';
import { GridFSBucket } from 'mongodb';
import fs from 'fs';

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
    const { fileName, skill, level } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Read the file data from the uploaded file in the temporary location
    const fileData = fs.readFileSync(req.file.path);

    // Create a new importedScore entry
    const newScore = {
      fileData,
      fname: fileName,
      level: level || 0,
      skill: skill || '',
    };

    // Add the new score to the user's importedScores array
    user.importedScores.push(newScore);

    // Save the user with the new score
    await user.save();

    // Optionally delete the file from the temporary location
    fs.unlinkSync(req.file.path);

    res
      .status(200)
      .json({ msg: 'File uploaded and stored in MongoDB successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ msg: 'Error uploading file' });
  }
};

const getUserImportedFile = async (req, res) => {
  const { userId, fileName } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const score = user.importedScores.find((score) => score.fname === fileName);

    if (!score) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', 'application/xml');
    res.send(score.file.data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const removeXMLFile = async (req, res) => {
  const { userId } = req.params;
  const { fileId } = req.body; // Expect fileId in the request body

  console.log(`Removing XML file: userId=${userId}, fileId=${fileId}`);

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid userId format' });
  }

  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid fileId format' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' });
    }
  } catch {
    console.log('Error');
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
  getUserImportedFile,
  removeXMLFile,
  updateRecordingsPastWeek,
};
