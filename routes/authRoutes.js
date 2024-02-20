import express from "express";
const router = express.Router();
import { register, login, updateUser, updateProfileData, getProfileData } from "../controllers/authController.js";
import authenticateUser from "../middleware-jb/authenticateUser.js";

import bodyParser from 'body-parser';
// Middleware setup for parsing form data
const formParser = bodyParser.urlencoded({ extended: false });

// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").patch(authenticateUser, formParser, updateUser);
router.route("/updateProfileData").post(authenticateUser, formParser, updateProfileData);
//router.route("/updateProfileData").post(updateProfileData);
router.route("/getProfileData").get(getProfileData);

export default router;
