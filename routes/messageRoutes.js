import express from "express";
const messageRouter = express.Router();
import { putMessage, getAllMessages } from "../controllers/messageController.js";


messageRouter.route("/getAllMessages").get(getAllMessages);
messageRouter.route("/putMessage").put(putMessage);
//messageRouter.route("/patchMessage").patch(patchMessage);
//messageRouter.route('/deleteMessage/:recordingId').delete(deleteMessage);

export default messageRouter;
