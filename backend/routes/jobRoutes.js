const express = require("express");
const {
  getJobs,
  getJobById,
  getUpcomingDeadlines,
  createJob,
  updateJob,
  deleteJob
} = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getJobs);
router.get("/deadlines", getUpcomingDeadlines);
router.get("/:id", getJobById);

// Admin protected
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
