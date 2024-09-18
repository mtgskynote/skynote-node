import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { parseStringPromise } from 'xml2js'; // For XML parsing

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
    const { fileName, scoreTitle, skill } = req.body;

    console.log(`Adding XML file: userId=${userId}, fileId=${fileName}`);

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Get the file path from the uploaded file
    const filePath = req.file.path;
    console.log(filePath);
    const fileExtension = path.extname(fileName).toLowerCase();

    let fileDataString;

    if (fileExtension === '.mxl') {
      // Uncompress the .mxl file to get the container XML
      const zip = new AdmZip(filePath);
      const zipEntries = zip.getEntries();
      const containerEntry = zipEntries.find((entry) =>
        entry.entryName.endsWith('.xml')
      );

      if (!containerEntry) {
        throw new Error('No container XML file found in the .mxl archive');
      }

      const containerXml = containerEntry.getData().toString('utf8');

      // Parse the container XML to find the path of the MusicXML file
      const containerData = await parseStringPromise(containerXml);
      const rootFilePath =
        containerData.container.rootfiles[0].rootfile[0]['$']['full-path'];

      // Find the actual MusicXML file in the archive
      const xmlEntry = zipEntries.find(
        (entry) => entry.entryName === rootFilePath
      );
      if (!xmlEntry) {
        throw new Error('No MusicXML file found in the .mxl archive');
      }

      fileDataString = xmlEntry.getData().toString('utf8');
    } else {
      // Read the file directly if it's not .mxl
      fileDataString = fs.readFileSync(filePath, 'utf8');
    }

    const newScore = {
      fileData: fileDataString,
      fname: fileName,
      scoreTitle: scoreTitle || fileName,
      skill: skill || '',
    };

    // Add the new score to the user's importedScores array
    user.importedScores.push(newScore);
    await user.save();

    // Remove the temporary file
    fs.unlinkSync(filePath);

    // Find the newly added score's to return (for _id, etc.)
    const addedScore = user.importedScores.find(
      (score) => score.fname === fileName && score.fileData === fileDataString
    );

    if (!addedScore) {
      throw new Error('Newly added score not found.');
    }

    res.status(200).json({
      msg: 'File uploaded and stored in MongoDB successfully',
      score: addedScore,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ msg: 'Error uploading file' });
  }
};

const removeXMLFile = async (req, res) => {
  const { userId } = req.params;
  const { fileId } = req.body; // Expect fileId in the request body

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
  removeXMLFile,
  updateRecordingsPastWeek,
};
