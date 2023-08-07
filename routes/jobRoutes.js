import express from "express";
const router = express.Router();

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from "../controllers/jobsController.js";

import authenticateUser from "../middleware-jb/authenticateUser.js";

router.route("/").post(createJob).get(getAllJobs);
// place before :id
router.route("/stats").get(authenticateUser, showStats);
router.route("/:id").delete(deleteJob).patch(updateJob);

export default router;
