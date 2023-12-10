import express from "express";
const router = express.Router();
import { register, login, updateUser, updateProfileData } from "../controllers/authController.js";
import authenticateUser from "../middleware-jb/authenticateUser.js";

// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").patch(authenticateUser, updateUser);

router.route("/updateProfileData").patch(authenticateUser, updateProfileData);

export default router;
