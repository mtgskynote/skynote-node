import student_recordings from "../models/studentRecordings.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

/* see recordingRoutes.js for the routes that use these functions */


/*
  get a list of all the recording names that have been saved for a particular score
  axios.get("/api/v1/recordings/getRecNames", {params : {studentId: studentId, scoreId: scoreId}}
  return: res.body = [recordingName1, recordingName2, ...]
*/
const getRecData = async (req, res) => {
 
  console.log(`in getRecData  ..............`)

    var recdata=[];  // list of core recording data [{recordingName, recordingId},{...}, ...] 
    const studentId=req.query.studentId;
    const scoreId=req.query.scoreId;
    
    let docs = await student_recordings.find({studentId: studentId, scoreId: scoreId});
    //console.log(`in recordingController.js getRecData function, docs is ${JSON.stringify(docs)}`) 

    for (let i = 0; i < docs.length; i++) {
        recdata.push({recordingName: docs[i].recordingName, recordingId: docs[i]._id} );
    }
    res.status(200).json(recdata);
    
  };

  /* 
    get a recording from the database
    parameter: req.body = {studentId: studentId, recordingName: recordingName}
    return: res.body = one student_recordings document
  */
const getRecording = async (req, res) => {

  const recordingId=req.query.recordingId;

  console.log(
    `in recordingController.js, recordingId is ${recordingId}`);

  let doc = await student_recordings.findOne({recordingId: recordingId});
  res.status(StatusCodes.OK).json(doc);
};

  /*
    put a recording into the database
    parameter: req.body = student_recordings
    return: status code
  */
  const putRecording = async (req, res) => {    
    console.log(
      `in recordingController.js putRecording function, req.body is ${JSON.stringify(req.body)}`
    );
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

  /*
    patch the viewPermissions field of a recording in the database
    parameter: req.body = {recordingId: recordingId, viewPermissions: viewPermissions}
    return: status code
  */
  const patchViewPermissions = async (req, res) => {
    try {
      const recordingId = req.body.recordingId;
      const sharing = req.body.sharing;
      console.log(`in recordingController.js patchViewPermissions function`)
      console.log(`     req.body.sharing = ${req.body.sharing}`)

      // // Validate sharing if necessary
      // if (typeof sharing !== 'boolean') {
      //     return res.status(400).send('viewPermissions must be a boolean value');
      // }

      // // Find the recording by ID and update the sharing field
      // const updatedRecording = await student_recordings.findOneAndUpdate(
      //     /* { _id: recordingId }, */
      //     { recordingId: recordingId  },
      //     { sharing: sharing },
      //     /* { new: true } // This option returns the updated document */
      // );

      // if (!updatedRecording) {
      //     return res.status(404).send('student_recordings not found');
      // }

      res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
  }


  /* recordingRouter.route("/deleteRecording").delete(deleteRecording); */
  const deleteRecording = async (req, res) => {
    console.log('OK!! Inside deleteRecording controller!')
    try {
      //const recordingId=req.query.recordingId;
      const recordingId = req.params.recordingId;
      console.log(`in deleteRecording, got a request to delete recordingId ${recordingId}`)
      const result = await student_recordings.findByIdAndDelete(recordingId );

      if (!result) {
          return res.status(404).send('Could not delete, document not found');
      }

      res.send('Document successfully deleted');
    } catch (error) {
        res.status(500).send('Server error in deleteRecording function');
    }
  }
  
export { getRecData, getRecording, putRecording, deleteRecording, patchViewPermissions};
