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

    var data=[]; 
    const studentId=req.query.studentId;
    console.log("student id received ", studentId)
    
    let docs = await assignments.find({students: studentId}); //Find all assignments for a given studentID

    for (let i = 0; i < docs.length; i++) {
        const assignment=docs[i]
        var task_info=[]
        for (let j=0; j<assignment.tasks.length; j++){
          const task=assignment.tasks[j]
          const answer_info=[]
          for (let k=0; k<task.answers.length; k++){
            const answer=task.answers[k]
            console.log("compare ", answer.studentId, studentId)
            if (answer.studentId.equals(studentId)){
              answer_info.push({comment:answer.comment, recordingId:answer.recordingId, grade:answer.grade})
            }
          }
          task_info.push({score: task.score, answer:answer_info[0]})
        }
        data.push({_id: assignment._id, message: assignment.message, postDate: assignment.post, dueDate:assignment.due, tasks:task_info , teacher: assignment.teacherId} );
    }
    res.status(200).json(data);
  };
  
export { getAllAssignments};
