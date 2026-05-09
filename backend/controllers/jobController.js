const Job = require("../models/Job");
const Subscriber = require("../models/Subscriber");
const { sendJobAlertEmail } = require("../services/emailService");
const { notifyBookmarkedUsers } = require("../services/bookmarkAlertService");

// Parse lastDate string to Date
function parseLastDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  const parts = dateStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (parts) return new Date(`${parts[2]} ${parts[1]}, ${parts[3]}`);
  return null;
}

function daysUntil(targetDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

// GET all jobs with filtering
exports.getJobs = async (req, res) => {
  try {
    const { qualification, ageLimit, category, state, department, isTrending, search, type } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (qualification) query.qualification = qualification;
    if (ageLimit) query.ageLimit = ageLimit;
    if (category) query.category = { $regex: category, $options: "i" };
    if (state) query.state = state;
    if (department) query.department = department;
    if (isTrending) query.isTrending = isTrending === "true";
    if (type) query.type = type;

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// GET single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

// GET upcoming deadlines (within 7 days)
exports.getUpcomingDeadlines = async (req, res) => {
  try {
    const jobs = await Job.find();
    const upcoming = [];

    for (const job of jobs) {
      const lastDate = parseLastDate(job.lastDate);
      if (!lastDate) continue;
      const days = daysUntil(lastDate);
      if (days >= 0 && days <= 7) {
        upcoming.push({
          ...job.toObject(),
          daysLeft: days,
          parsedLastDate: lastDate
        });
      }
    }

    upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch deadlines" });
  }
};

// POST new job + send notifications
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    // Send email notifications to all active email subscribers
    try {
      const emailSubs = await Subscriber.find({
        isActive: true,
        channels: "email",
        email: { $exists: true, $ne: null }
      });
      if (emailSubs.length > 0) {
        const emails = emailSubs.map(s => s.email);
        await sendJobAlertEmail(emails, job);
        console.log(`📧 Job alert sent to ${emails.length} subscribers`);
      }
    } catch (notifErr) {
      console.error("Notification error (non-blocking):", notifErr.message);
    }

    // Trigger bookmark alerts for Result/Admit Card/Answer Key
    if (["Result", "Admit Card", "Answer Key"].includes(job.type)) {
      try {
        await notifyBookmarkedUsers(job);
      } catch (alertErr) {
        console.error("Bookmark alert error (non-blocking):", alertErr.message);
      }
    }

    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: "Failed to create job" });
  }
};

// PUT update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: "Failed to update job" });
  }
};

// DELETE job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
};
