import express from 'express';
const audioFeaturesRouter = express.Router();
import { processAudio } from '../controllers/audioFeaturesController.js';

audioFeaturesRouter.route('/process-audio').post(processAudio);

export default audioFeaturesRouter;
