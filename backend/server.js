const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config();

const Job = require("./models/Job");
const Event = require("./models/Event");
const Notification = require("./models/Notification");
const Admin = require("./models/Admin");

// Routes
const jobRoutes = require("./routes/jobRoutes");
const adminRoutes = require("./routes/adminRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const userRoutes = require("./routes/userRoutes");

// Services
const { startDeadlineReminderCron, checkAndSendReminders } = require("./services/deadlineReminderService");

const app = express();
app.use(cors());
app.use(express.json());

// ─── ROOT CHECK ───
app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀", timestamp: new Date().toISOString() });
});

// ─── MOUNT ROUTES ───
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/users", userRoutes);

// ─── EVENT ROUTES ───
const { getEvents, createEvent, updateEvent, deleteEvent } = require("./controllers/eventController");
const protect = require("./middleware/authMiddleware");

app.get("/api/events", getEvents);
app.post("/api/events", protect, createEvent);
app.put("/api/events/:id", protect, updateEvent);
app.delete("/api/events/:id", protect, deleteEvent);

// ─── NOTIFICATION ROUTES ───
const { getNotifications, createNotification, deleteNotification } = require("./controllers/notificationController");

app.get("/api/notifications", getNotifications);
app.post("/api/notifications", protect, createNotification);
app.delete("/api/notifications/:id", protect, deleteNotification);

// ─── STATS ENDPOINT ───
app.get("/api/stats", async (req, res) => {
  try {
    const [jobCount, eventCount, notifCount, subscriberCount] = await Promise.all([
      Job.countDocuments(),
      Event.countDocuments(),
      Notification.countDocuments(),
      mongoose.model("Subscriber").countDocuments({ isActive: true })
    ]);
    res.json({
      totalJobs: jobCount,
      totalEvents: eventCount,
      totalNotifications: notifCount,
      totalSubscribers: subscriberCount
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// ─── ADMIN REGISTER ───
app.post("/api/admin/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashed });
    res.status(201).json({ message: "Admin registered", id: admin._id });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// ─── MANUAL REMINDER TRIGGER (admin) ───
app.post("/api/reminders/check", protect, async (req, res) => {
  try {
    const result = await checkAndSendReminders();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Reminder check failed" });
  }
});

// ─── SEED DATA ───
app.post("/api/seed", async (req, res) => {
  try {
    await Job.deleteMany();
    await Event.deleteMany();
    await Notification.deleteMany();

    const { jobs, events, notifications } = require("./seedData");

    await Job.insertMany(jobs);
    await Event.insertMany(events);
    await Notification.insertMany(notifications);

    // Create a default admin account
    const existingAdmin = await Admin.findOne({ email: "admin@examportal.com" });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash("admin123", 10);
      await Admin.create({ email: "admin@examportal.com", password: hashed });
      console.log("Default admin created: admin@examportal.com / admin123");
    }

    res.json({ message: "Database seeded successfully!", jobs: jobs.length, events: events.length, notifications: notifications.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seeding failed" });
  }
});

// ─── DATABASE CONNECTION ───
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected remotely ✅");
  } catch (err) {
    console.log("Remote DB failed. Falling back to in-memory MongoDB...");
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log("In-Memory MongoDB connected ✅");
  }
}

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log(`Backend running at http://localhost:${PORT}`);

    // Auto-seed if empty
    try {
      const count = await Job.countDocuments();
      if (count === 0) {
        console.log("Seeding database...");
        await fetch(`http://localhost:${PORT}/api/seed`, { method: "POST" });
      }
    } catch (e) {
      console.log("Auto-seed skipped:", e.message);
    }

    // Start deadline reminder cron
    startDeadlineReminderCron();
  });
});
