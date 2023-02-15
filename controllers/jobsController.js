const createJob = (req, res) => {
  res.send("create job");
};
const getAllJobs = (req, res) => {
  res.send("getAllJobs job");
};

const updateJob = (req, res) => {
  res.send("updateJob job");
};

const deleteJob = (req, res) => {
  res.send("deleteJob job");
};

const showStats = (req, res) => {
  res.send("showStats job");
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
