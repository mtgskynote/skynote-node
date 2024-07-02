import express from "express";
import {
  changePassword,
  updateProfileData,
  addFavourite, 
  removeFavourite
} from "../controllers/profileController.js";
import { authenticateUser } from "../middleware-jb/authenticateUser.js";

import bodyParser from "body-parser";
// Middleware setup for parsing form data
const formParser = bodyParser.urlencoded({ extended: false });

const router = express.Router();

router
  .route("/changePassword")
  .post(authenticateUser, formParser, changePassword);
router
  .route("/updateProfileData")
  .post(authenticateUser, formParser, updateProfileData);
router.route("/favourite/:userId/:songId")
  .post(authenticateUser, addFavourite)
  .delete(authenticateUser, removeFavourite);

export default router;
