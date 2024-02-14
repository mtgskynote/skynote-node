import assignments from "../models/Assignments.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

/* see assignmentRoutes.js for the routes that use these functions */


/* getAllAssignments -----------
  get a list of all the recording names that have been saved for a particular score
  axios.get("/api/v1/recordings/getRecNames", {params : {studentId: studentId, scoreId: scoreId}}
  return: res.body = [{recordingName1, recordingName2, ...]
*/
const getAllAssignments = async (req, res) => {

  var data=[];  // list of core recording data [{recordingName, recordingId},{...}, ...] 
  //const studentId=req.query.studentId;
  
  let docs = await assignments.find(); //Find all recordings for a given studentID {"students.studentId": studentId}
  console.log("DOCSSSS ", docs)

  for (let i = 0; i < docs.length; i++) {
      data.push(docs);
  }
  res.status(200).json(data);
};

const putAssignment = async (req, res) => {    
  try {
    const newAssignment = new assignments(req.body);
    await newAssignment.save();
    console.log(`newAssignment infor is ${newAssignment}`) 
    // res.status().json(info) puts info in the .data field of the response!!
    // res.status(201).json({recordingName: newAssignment.recordingName, recordingId: newAssignment._id});
  } catch (error) {
      res.status(400).send(error);
  }
}

  
export { getAllAssignments, putAssignment };
