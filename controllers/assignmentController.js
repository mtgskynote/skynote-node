import assignments from "../models/Assignments.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

/* see recordingRoutes.js for the routes that use these functions */


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

  
export { getAllAssignments};
