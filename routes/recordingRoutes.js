import express from "express";
const recordingRouter = express.Router();
import { getRecData, getRecording, putRecording, deleteRecording, patchViewPermissions } from "../controllers/recordingController.js";

// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.
recordingRouter.route("/getRecData").get(getRecData);
recordingRouter.route("/getRecording").get(getRecording);
recordingRouter.route("/putRecording").put(putRecording);
recordingRouter.route("/patchViewPermissions").patch(patchViewPermissions);
recordingRouter.route('/deleteRecording/:recordingId').delete(deleteRecording);

recordingRouter.route("/testupload").post((req, res) => {
  res.send({ msg: "!!!!!!!!!!!!!!!!!!!!!!!!!!!                   recordingRouter" });
}); // this is just a test


export default recordingRouter;
