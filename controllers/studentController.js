import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";


/*
  Get the location 
*/
const location = async (req, res) => {
  let levellist = await User.findById("level");
  res.status(StatusCodes.OK).json(levellist);
};



export { location };
