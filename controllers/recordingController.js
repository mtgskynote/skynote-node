import student_recordings from '../models/StudentRecordings.js';
import { StatusCodes } from 'http-status-codes';

/* see recordingRoutes.js for the routes that use these functions */

/* getRecData -----------
  get a list of all the recording names that have been saved for a particular score
  axios.get("/api/v1/recordings/getRecNames", {params : {studentId: studentId, scoreId: scoreId}}
  return: res.body = [{recordingName1, recordingName2, ...]
*/
const getRecData = async (req, res) => {
  var recdata = []; // list of core recording data [{recordingName, recordingId},{...}, ...]
  const studentId = req.query.studentId;
  const scoreId = req.query.scoreId;

  let docs = await student_recordings.find({
    studentId: studentId,
    scoreId: scoreId,
  });

  for (let i = 0; i < docs.length; i++) {
    recdata.push({
      recordingName: docs[i].recordingName,
      recordingId: docs[i]._id,
      recordingStars: docs[i].info.stars,
      recordingDate: docs[i].date,
    });
  }
  res.status(200).json(recdata);
};

const getAllRecData = async (req, res) => {
  var recdata = []; // list of core recording data [{recordingName, recordingId},{...}, ...]
  const studentId = req.query.studentId;

  let docs = await student_recordings.find(
    { studentId: studentId },
    { audio: 0 }
  ); //Find all recordings for a given studentID

  for (let i = 0; i < docs.length; i++) {
    recdata.push({
      recordingName: docs[i].recordingName,
      recordingId: docs[i]._id,
      scoreID: docs[i].scoreId,
      recordingStars: docs[i].info.stars,
      recordingDate: docs[i].date,
    });
  }
  res.status(200).json(recdata);
};

/*  getRecording -----------
    get a recording from the database
    parameter: req.body = {params: {recordingId: recordingId}}
    return: res.body = one student_recording document from mongodb
  */
const getRecording = async (req, res) => {
  const recordingId = req.query.recordingId;

  console.log(`in recordingController.js, recordingId is ${recordingId}`);

  let doc = await student_recordings.findOne({ _id: recordingId });
  res.status(StatusCodes.OK).json(doc);
};

/**
 * getManyRecordings
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.query.recordingIds - Comma-separated list of recording IDs
 *
 * @returns {Object} Array of recording objects, each with an _id and an audio field
 */
const getManyRecordings = async (req, res) => {
  const recordingIds = req.query.recordingIds;
  console.log(`Getting the following recording IDs: ${recordingIds}`);

  try {
    // Use toArray() to retrieve documents matching the query
    const recordingAudios = [];
    let docs = await student_recordings.find(
      { _id: { $in: recordingIds } },
      { _id: 1, audio: 1 }
    );

    docs.forEach((doc) => {
      recordingAudios.push({
        _id: doc._id,
        audio: doc.audio,
      });
    });

    res.status(StatusCodes.OK).json(recordingAudios); // Send the array of documents as JSON response
  } catch (error) {
    console.error('Error fetching recordings:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error' });
  }
};

/* putRecording -----------
    put a recording into the database
    parameter: req.body = student_recordings
    return: status code
  */
const putRecording = async (req, res) => {
  try {
    const newRecording = new student_recordings(req.body);
    await newRecording.save();
    console.log(
      `newRecording infor is ${JSON.stringify({
        recordingName: newRecording.recordingName,
        recordingId: newRecording._id,
      })}`
    );
    // res.status().json(info) puts info in the .data field of the response!!
    res.status(201).json({
      recordingName: newRecording.recordingName,
      recordingId: newRecording._id,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

/* patchViewPermissions ----------- 
    patch the viewPermissions field of a recording in the database
    parameter: req.body = {recordingId: recordingId, sharing: sharing} // sharing is boolean - true to allow teacher to see
    return: status code
  */
const patchViewPermissions = async (req, res) => {
  try {
    const recordingId = req.body.recordingId;
    const sharing = req.body.sharing;
    console.log(`in recordingController.js patchViewPermissions function`);
    console.log(`     req.body.sharing = ${req.body.sharing}`);

    // Validate sharing if necessary
    if (typeof sharing !== 'boolean') {
      return res.status(400).send('viewPermissions must be a boolean value');
    }

    // Find the recording by ID and update the sharing field
    const updatedRecording = await student_recordings.findOneAndUpdate(
      /* { _id: recordingId }, */
      { _id: recordingId },
      { sharing: sharing }
      /* { new: true } // This option returns the updated document */
    );

    if (!updatedRecording) {
      return res.status(404).send('student_recordings not found');
    }

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

/* deleteRecording -----------
  parameter sent in URL : axios.delete(`/api/v1/recordings/deleteRecording/${recordingId}`);
  return status code  
  */
const deleteRecording = async (req, res) => {
  try {
    const recordingId = req.params.recordingId;
    console.log(
      `in deleteRecording, got a request to delete recordingId ${recordingId}`
    );
    const result = await student_recordings.findByIdAndDelete(recordingId);

    if (!result) {
      return res.status(404).send('Could not delete, document not found');
    }

    res.status(200).send('Document successfully deleted');
  } catch (error) {
    res.status(500).send('Server error in deleteRecording function');
  }
};

/* editRecording -----------
    put a recording into the database
    parameter: req.body = student_recordings
    return: status code
  */
const editRecording = async (req, res) => {
  try {
    const recordingId = req.body.id;
    const recordingName = req.body.name;
    let updatedRecording = await student_recordings.findOneAndUpdate(
      { _id: recordingId },
      { recordingName: recordingName }
    );
    if (!updatedRecording) {
      return res.status(404).json({ error: 'Recording not found' });
    }
    res.status(200).json(updatedRecording);
  } catch (error) {
    console.error('Error updating recording:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  getRecData,
  getAllRecData,
  getRecording,
  putRecording,
  deleteRecording,
  patchViewPermissions,
  editRecording,
  getManyRecordings,
};
