import express from "express";
const scoreRouter = express.Router();
import { names, levels, skills, xml } from "../controllers/scoreController.js";


// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.
scoreRouter.route("/names").get(names);
scoreRouter.route("/levels").get(levels);
scoreRouter.route("/skills").get(skills);
scoreRouter.route("/xml").get(xml);

export default scoreRouter;
