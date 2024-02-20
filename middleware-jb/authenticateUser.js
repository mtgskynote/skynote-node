/**
 * Middleware function to authenticate user using JWT token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {UnAuthenticatedError} If authentication fails.
 */
import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index.js";

const authenticateUser = async (req, res, next) => {
  //console.log(`In authenticateUser, req.headers is ${JSON.stringify(req.headers)}`)
  const authHeader = req.headers.authorization;
  //console.log("authHeader", authHeader);
  console.log("Authenticating...");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload", payload);
    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    throw new UnAuthenticatedError("Authentication invalid");
  }
};

export default authenticateUser;
