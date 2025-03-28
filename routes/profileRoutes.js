import express from 'express';
import {
  changePassword,
  updateProfileData,
  addFavourite,
  removeFavourite,
  uploadXMLFile,
  removeXMLFile,
  updateXMLFile,
  updateRecordingsPastWeek,
} from '../controllers/profileController.js';
import { authenticateUser } from '../middleware-jb/authenticateUser.js';
import upload from '../middleware-jb/uploadConfig.js';
import bodyParser from 'body-parser';
// Middleware setup for parsing form data
const formParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

router
  .route('/changePassword')
  .post(authenticateUser, formParser, changePassword);
router
  .route('/updateProfileData')
  .post(authenticateUser, formParser, updateProfileData);
router
  .route('/favourite/:userId/:songId')
  .post(authenticateUser, addFavourite)
  .delete(authenticateUser, removeFavourite);
router
  .route('/uploadXML/:userId')
  .post(authenticateUser, upload.single('file'), uploadXMLFile);
router
  .route('/removeXMLFile/:userId/:importID')
  .delete(authenticateUser, removeXMLFile);
router.route('/updateXMLFile/:scoreId').put(authenticateUser, updateXMLFile);
router
  .route('/recordingsPastWeek/:userId')
  .post(authenticateUser, updateRecordingsPastWeek);

export default router;
