import express from "express";
const router = express.Router();
import { register, login, updateUser } from "../controllers/authController.js";

// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").patch(updateUser);

export default router;
