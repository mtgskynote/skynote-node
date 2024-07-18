import xmlScores from '../models/xmlScoreModel.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { match } from 'assert'
const pathname = '/xmlScores/violin'
const rootScorePath = '../../public/xmlScores/violin'
// import cors from "cors";

// // Create an instance of the Express Router
// const scoreRouter = express.Router();

// // Use the 'cors' middleware before your route handlers
// scoreRouter.use(cors());

/*
  Requester may want just the name, a URL, or the path to the file (from /public) for their convenience
*/
const formatName = function (fname, format) {
  if (format && format == 'URL') {
    //    return "https://appskynote.com" + pathname + "/" + fname + ".xml";
    return rootScorePath + '/' + pathname + '/' + fname + '.xml'
  }
  if (format && format == 'path') {
    return pathname + '/' + fname + '.xml'
  }
  return fname
}
/*
  Get a list of all the file names with 'level' and/or 'skill' (provided in the req.body)
*/
const names = async (req, res) => {
  console.log(`in score name function, req.body is ${JSON.stringify(req.body)}`)
  const { level, skill, format } = req.body //(integer) level, (string) skill, format = "name" || "URL" || "path"
  let match = {}
  if (level) {
    match.level = level
  }
  if (skill) {
    match.skill = skill
  }

  let docs = await xmlScores.find(match) //({level: level, skill: skill})
  let docnames = []
  for (let i = 0; i < docs.length; i++) {
    docnames.push({
      scoreXmlName: formatName(docs[i].fname, format),
      scoreId: docs[i]._id,
      scoreLevel: docs[i].level,
      scoreSkill: docs[i].skill,
    })
  }
  res.status(StatusCodes.OK).json(docnames)
}

/*
  Get a list of all skills at a certain 'level' (optionally provided in the req.body)
*/
const skills = async (req, res) => {
  const { level } = req.body
  let match = {}
  if (level) {
    match.level = level
  }
  let skillsList = await xmlScores.distinct('skill', match)
  res.status(StatusCodes.OK).json(skillsList)
}

/*
  Get a list of all levels 
*/
const levels = async (req, res) => {
  let levellist = await xmlScores.distinct('level')
  res.status(StatusCodes.OK).json(levellist)
}

/*
  return xml of file
*/
const __dirname = dirname(fileURLToPath(import.meta.url))
const scoreLocation = __dirname + '/../client-jb/public' + pathname
const xml = async (req, res) => {
  let { fname } = req.body
  if (!fname) {
    throw new BadRequestError('need a score name to retrieve')
  }
  let extname = fname + '.xml'
  // should check for existance
  res.sendFile(extname, { root: scoreLocation })

  //res.sendFile(extname, { root: scoreLocation });
  // https://appskynote.com/musicXmlFiles/74_Minuet_2.xml
}

// //scoreRouter.route("/getAllScoreDataa").get(getAllScoreData);
// const getAllScoreData = async (req, res) => {
//   console.log("in allScoreData");
//   let data = {};
//   try{
//     let levels = await xmlScores.distinct("level");

//     for (let level of levels) {
//       let  skills = await xmlScores.distinct("skill", {level: level});
//       data[level] = {};
//       //let skillnum=0
//       for (let skill of skills) {
//         let names = await xmlScores.find({level: level, skill: skill});
//         //data[level][skillnum] = names;

//         data[level][skill] = names.map((name) => ({
//           name,
//           path: `${pathname}/${name}.xml`,
//           route_path: `/all-lessons/${name}.xml`,
//         }));
//         console.log(`-----data[${level}][${skill}] is ${JSON.stringify(data)}\n`)
//         //skillnum++
//       }
//     }
//     //console.log(`-----------data is ${JSON.stringify(data)}`)
//     res.status(StatusCodes.OK).json(data);
//   } catch (error) {
//     console.log(`error in getAllScoreData`, error)
//   }
// }

//Lonce's
const getAllScoreData = async (req, res) => {
  try {
    const levels_ = await xmlScores.distinct('level')
    console.log('call 1')
    const data = {}

    for (let level of levels_) {
      let match = { level: level }
      const skills_ = await xmlScores.distinct('skill', match)
      data[level] = {}
      console.log('call 2')

      for (let skill of skills_) {
        let match = { level: level, skill: skill }
        let docs = await xmlScores.find(match)
        console.log('call 3')

        let names_ = []
        for (let i = 0; i < docs.length; i++) {
          names_.push(formatName(docs[i].fname))
        }

        //console.log(`names for level ${level} and skill ${skill} are ${JSON.stringify(names_)}`  )

        data[level][skill] = names_.map((name) => ({
          name,
          path: `${pathname}/${name}.xml`,
          route_path: `/all-lessons/${name}.xml`,
        }))
      }
    }
    //console.log("All data fetched:", data);
    console.log('in getAllScoreData, returning data')
    res.status(StatusCodes.OK).json(data)
    //return data;
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

//Our
const getAllScoreData2 = async (req, res) => {
  try {
    const allScores = await xmlScores.find()
    res.status(StatusCodes.OK).json(allScores)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

/**
 * Retrieves a score by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getScoreById = async (req, res) => {
  try {
    // Find the score by its ID
    const score = await xmlScores.findById(req.params.scoreId)
    // If score is not found, return a 404 error
    if (!score) {
      return res.status(404).json({ error: 'Score not found' })
    }
    // If score is found, return it with a 200 status code
    res.status(StatusCodes.OK).json(score)
  } catch (err) {
    // If an error occurs, log it and return a 500 error
    console.log(err)
    res.status(500).json({ error: err })
  }
}

export {
  names,
  levels,
  skills,
  xml,
  getAllScoreData,
  getAllScoreData2,
  getScoreById,
}
