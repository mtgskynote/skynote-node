import assignments from '../models/Assignments.js';
import { StatusCodes } from 'http-status-codes';

/* see assignmentRoutes.js for the routes that use these functions */
const getAllAssignments = async (req, res) => {
  var data = [];
  const studentId = req.query.studentId;
  let docs = await assignments.find({ students: studentId }); //Find all assignments for a given studentID
  for (let i = 0; i < docs.length; i++) {
    const assignment = docs[i];
    var task_info = [];
    for (let j = 0; j < assignment.tasks.length; j++) {
      const task = assignment.tasks[j];
      const answer_info = [];
      for (let k = 0; k < task.answers.length; k++) {
        const answer = task.answers[k];
        if (answer.studentId.equals(studentId)) {
          answer_info.push({
            comment: answer.comment,
            recordingId: answer.recordingId,
            grade: answer.grade,
          });
        }
      }
      task_info.push({ score: task.score, answer: answer_info[0] });
    }
    data.push({
      _id: assignment._id,
      message: assignment.message,
      postDate: assignment.post,
      dueDate: assignment.due,
      tasks: task_info,
      teacher: assignment.teacherId,
    });
  }
  res.status(200).json(data);
};

const putAssignment = async (req, res) => {
  try {
    const newAssignment = new assignments(req.body);
    await newAssignment.save();
    console.log(`newAssignment infor is ${newAssignment}`);
    // res.status().json(info) puts info in the .data field of the response!!
    // res.status(201).json({recordingName: newAssignment.recordingName, recordingId: newAssignment._id});
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    console.log(
      `in deleteAssignment, got a request to delete assignmentId ${assignmentId}`
    );
    const result = await assignments.findByIdAndDelete(assignmentId);

    if (!result) {
      return res.status(404).send('Could not delete, document not found');
    }

    res.status(200).send('Document successfully deleted');
  } catch (error) {
    res.status(500).send('Server error in deleteAssignment function');
  }
};

const getLatestAssignment = async (req, res) => {
  const studentId = req.query.studentId;

  console.log(`in assignmentController.js, studentId is ${studentId}`);

  // let doc = await assignments.findOne(
  //   { students: { $elemMatch: { $eq: studentId } } },
  //   { sort: { post: -1 } });

  let doc = await assignments.aggregate([
    { $sort: { post: -1 } }, // Sort documents based on the dateField in descending order
    { $limit: 1 }, // Limit the result to only one document, which will be the one with the latest date
  ]);

  res.status(StatusCodes.OK).json(doc);
};

const updateTaskAssignment = async (req, res) => {
  const studentId = req.body.studentId;
  const assignmentId = req.body.assignmentId;
  const scoreId = req.body.scoreId;
  const recordingId = req.body.recordingId;
  try {
    let updatedAssignment = await assignments.findOneAndUpdate(
      {
        _id: assignmentId,
        'tasks.score': scoreId,
      },
      {
        $push: {
          'tasks.$[task].answers': {
            studentId: studentId,
            recordingId: recordingId,
          },
        },
      },
      {
        arrayFilters: [{ 'task.score': scoreId }],
        new: true,
      }
    );

    if (!updatedAssignment) {
      return res.status(404).json({
        error: 'Assignment not found or task with specified scoreId not found',
      });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  getAllAssignments,
  putAssignment,
  deleteAssignment,
  getLatestAssignment,
  updateTaskAssignment,
};
