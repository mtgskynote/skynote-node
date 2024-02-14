import assignments from "../models/Assignments.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

/* see assignmentRoutes.js for the routes that use these functions */



const getAllAssignments = async (req, res) => {

    var data=[]; 
    const studentId=req.query.studentId;
    let docs = await assignments.find({students: studentId}); //Find all assignments for a given studentID
    for (let i = 0; i < docs.length; i++) {
        const assignment=docs[i]
        var task_info=[]
        for (let j=0; j<assignment.tasks.length; j++){
          const task=assignment.tasks[j]
          const answer_info=[]
          for (let k=0; k<task.answers.length; k++){
            const answer=task.answers[k]
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
  
  const deleteAssignment = async (req, res) => {
    try {
      const assignmentId = req.params.assignmentId;
      console.log(`in deleteAssignment, got a request to delete assignmentId ${assignmentId}`)
      const result = await assignments.findByIdAndDelete(assignmentId);
  
      if (!result) {
          return res.status(404).send('Could not delete, document not found');
      }
  
      res.status(200).send('Document successfully deleted');
    } catch (error) {
        res.status(500).send('Server error in deleteAssignment function');
    }
  }
  
export { getAllAssignments, putAssignment, deleteAssignment };
