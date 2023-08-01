import xmlScores from "../models/xmlScoreModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

console.log("loading scoreController with the function getScores !!!!!!!!!!!!!")

/*
  Get a list of all the file names with 'level' and/or 'skill' (provided in the req.body)
*/
const names = async (req, res) => {
  console.log(`in score name function, req.body is ${JSON.stringify(req.body)}`)
  const { level, skill } = req.body;
  let match = {}
  if (level) {match.level = level} 
  if (skill) {match.skill = skill}

  console.log(`about to get score names with match params = ${JSON.stringify(match)}`)
  //throw new BadRequestError("no level or skill, so returnin entire list of scores");
  let docs = await xmlScores.find(match); //({level: level, skill: skill})
  let docnames=[];
  for(let i=0;i<docs.length;i++) {docnames.push(docs[i].fname);}
  res.status(StatusCodes.OK).json(docnames);
};

/*
  Get a list of all skills at a certain 'level' (optionally provided in the req.body)
*/
const skills = async (req, res) => {
    const { level } = req.body;
    let match = {};
    if (level) {match.level = level} 
    let skillslist = await xmlScores.distinct("skill", match) 
    res.status(StatusCodes.OK).json(skillslist);
}

/*
  Get a list of all levels 
*/
const levels = async (req, res) => {
  let levellist = await xmlScores.distinct("level") 
  res.status(StatusCodes.OK).json(levellist);
}


export { names, levels, skills };
