import express from "express";
const scoreRouter = express.Router();
import { names, levels, skills, xml } from "../controllers/scoreController.js";

// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.
scoreRouter.route("/names").post(names);
scoreRouter.route("/levels").post(levels);
scoreRouter.route("/skills").post(skills);
scoreRouter.route("/xml").post(xml);

export default scoreRouter;
