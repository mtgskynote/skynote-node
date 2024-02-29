import express from "express";
const messageRouter = express.Router();
import { putMessage, getAllMessages, updateMessageSeen } from "../controllers/messageController.js";


messageRouter.route("/getAllMessages").get(getAllMessages);
messageRouter.route("/putMessage").put(putMessage);
messageRouter.route("/updateMessageSeen").put(updateMessageSeen);

export default messageRouter;
