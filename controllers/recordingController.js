import student_recordings from "../models/StudentRecordings.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

/* see recordingRoutes.js for the routes that use these functions */


/* getRecData -----------
  get a list of all the recording names that have been saved for a particular score
  axios.get("/api/v1/recordings/getRecNames", {params : {studentId: studentId, scoreId: scoreId}}
  return: res.body = [{recordingName1, recordingName2, ...]
*/
const getRecData = async (req, res) => {

    var recdata=[];  // list of core recording data [{recordingName, recordingId},{...}, ...] 
    const studentId=req.query.studentId;
    const scoreId=req.query.scoreId;
    
    let docs = await student_recordings.find({studentId: studentId, scoreId: scoreId});

    for (let i = 0; i < docs.length; i++) {
        recdata.push({recordingName: docs[i].recordingName, recordingId: docs[i]._id} );
    }
    res.status(200).json(recdata);
  };

  /*  getRecording -----------
    get a recording from the database
    parameter: req.body = {params: {recordingId: recordingId}}
    return: res.body = one student_recording document from mongodb
  */
const getRecording = async (req, res) => {
  const recordingId=req.query.recordingId;

  console.log(
    `in recordingController.js, recordingId is ${recordingId}`);

  let doc = await student_recordings.findOne({_id: recordingId});
  res.status(StatusCodes.OK).json(doc);
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
      console.log(`newRecording infor is ${JSON.stringify({recordingName: newRecording.recordingName, recordingId: newRecording._id})}`) 
      // res.status().json(info) puts info in the .data field of the response!!
      res.status(201).json({recordingName: newRecording.recordingName, recordingId: newRecording._id});
    } catch (error) {
        res.status(400).send(error);
    }
   }

  /* patchViewPermissions ----------- 
    patch the viewPermissions field of a recording in the database
    parameter: req.body = {recordingId: recordingId, sharing: sharing} // sharing is boolean - true to allow teacher to see
    return: status code
  */
  const patchViewPermissions = async (req, res) => {
    try {
      const recordingId = req.body.recordingId;
      const sharing = req.body.sharing;
      console.log(`in recordingController.js patchViewPermissions function`)
      console.log(`     req.body.sharing = ${req.body.sharing}`)

      // Validate sharing if necessary
      if (typeof sharing !== 'boolean') {
          return res.status(400).send('viewPermissions must be a boolean value');
      }

      // Find the recording by ID and update the sharing field
      const updatedRecording = await student_recordings.findOneAndUpdate(
          /* { _id: recordingId }, */
          { recordingId: recordingId  },
          { sharing: sharing },
          /* { new: true } // This option returns the updated document */
      );

      if (!updatedRecording) {
          return res.status(404).send('student_recordings not found');
      }

      res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
  }


  /* deleteRecording -----------
  parameter sent in URL : axios.delete(`/api/v1/recordings/deleteRecording/${recordingId}`);
  return status code  
  */
  const deleteRecording = async (req, res) => {
    try {
      const recordingId = req.params.recordingId;
      console.log(`in deleteRecording, got a request to delete recordingId ${recordingId}`)
      const result = await student_recordings.findByIdAndDelete(recordingId );

      if (!result) {
          return res.status(404).send('Could not delete, document not found');
      }

      res.status(200).send('Document successfully deleted');
    } catch (error) {
        res.status(500).send('Server error in deleteRecording function');
    }
  }
  
export { getRecData, getRecording, putRecording, deleteRecording, patchViewPermissions};
