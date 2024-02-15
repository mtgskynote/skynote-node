import express from "express";
const assignmentRouter = express.Router();
import { getAllAssignments, putAssignment, deleteAssignment, getLatestAssignment } from "../controllers/assignmentController.js";

// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.
assignmentRouter.route("/getAllAssignments").get(getAllAssignments);
assignmentRouter.route("/putAssignment").put(putAssignment);
assignmentRouter.route("/deleteAssignment/:assignmentId").delete(deleteAssignment);
assignmentRouter.route("/getLatestAssignment").get(getLatestAssignment);

assignmentRouter.route("/testupload").post((req, res) => {
  res.send({ msg: "!!!!!!!!!!!!!!!!!!!!!!!!!!!                   assignmentRouter" });
}); // this is just a test


export default assignmentRouter;