import express from "express";
const studentRouter = express.Router();
import { location } from "../controllers/studentController.js";

// will have POST and GET methods

// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.
studentRouter.route("/location").post(location);
//studentRouter.route("/location").get(location);

export default studentRouter;
