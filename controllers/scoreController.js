import xmlScores from "../models/xmlScoreModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
const pathname = "/xmlScores/violin";
// import cors from "cors";

// // Create an instance of the Express Router
// const scoreRouter = express.Router();

// // Use the 'cors' middleware before your route handlers
// scoreRouter.use(cors());

/*
  Requester may want just the name, a URL, or the path to the file (from /public) for their convenience
*/
const formatName = function (fname, format) {
  if (format && format == "URL") {
    return "https://appskynote.com" + pathname + "/" + fname + ".xml";
  }
  if (format && format == "path") {
    return pathname + "/" + fname + ".xml";
  }
  return fname;
};
/*
  Get a list of all the file names with 'level' and/or 'skill' (provided in the req.body)
*/
const names = async (req, res) => {
  console.log(
    `in score name function, req.body is ${JSON.stringify(req.body)}`
  );
  const { level, skill, format } = req.body; //(integer) level, (string) skill, format = "name" || "URL" || "path"
  let match = {};
  if (level) {
    match.level = level;
  }
  if (skill) {
    match.skill = skill;
  }

  let docs = await xmlScores.find(match); //({level: level, skill: skill})
  let docnames = [];
  for (let i = 0; i < docs.length; i++) {
    docnames.push(formatName(docs[i].fname, format));
  }
  res.status(StatusCodes.OK).json(docnames);
};

/*
  Get a list of all skills at a certain 'level' (optionally provided in the req.body)
*/
const skills = async (req, res) => {
  const { level } = req.body;
  let match = {};
  if (level) {
    match.level = level;
  }
  let skillsList = await xmlScores.distinct("skill", match);
  res.status(StatusCodes.OK).json(skillsList);
};

/*
  Get a list of all levels 
*/
const levels = async (req, res) => {
  let levellist = await xmlScores.distinct("level");
  res.status(StatusCodes.OK).json(levellist);
};

/*
  return xml of file
*/
const __dirname = dirname(fileURLToPath(import.meta.url));
const scoreLocation = __dirname + "/../client-jb/public" + pathname;
const xml = async (req, res) => {
  let { fname } = req.body;
  if (!fname) {
    throw new BadRequestError("need a score name to retrieve");
  }
  let extname = fname + ".xml";
  // should check for existance
  res.sendFile(extname, { root: scoreLocation });

  //res.sendFile(extname, { root: scoreLocation });
  // https://appskynote.com/musicXmlFiles/74_Minuet_2.xml
};

export { names, levels, skills, xml };
