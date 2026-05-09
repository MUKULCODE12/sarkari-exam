const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Job = require("../models/Job");
const UserAlert = require("../models/UserAlert");

// POST /api/users/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, notifChannels } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone: phone || "",
      notifChannels: notifChannels || ["inapp"]
    });
    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, notifChannels: user.notifChannels, bookmarkedJobs: user.bookmarkedJobs, createdAt: user.createdAt }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// POST /api/users/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, notifChannels: user.notifChannels, bookmarkedJobs: user.bookmarkedJobs, createdAt: user.createdAt }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").populate("bookmarkedJobs");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, notifChannels } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (notifChannels) user.notifChannels = notifChannels;
    await user.save();
    res.json({ message: "Profile updated", user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, notifChannels: user.notifChannels, bookmarkedJobs: user.bookmarkedJobs } });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// POST /api/users/bookmarks/:jobId
exports.addBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (!user.bookmarkedJobs.includes(jobId)) {
      user.bookmarkedJobs.push(jobId);
      await user.save();
    }
    res.json({ message: "Bookmarked", bookmarkedJobs: user.bookmarkedJobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to bookmark" });
  }
};

// DELETE /api/users/bookmarks/:jobId
exports.removeBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.bookmarkedJobs = user.bookmarkedJobs.filter(id => id.toString() !== req.params.jobId);
    await user.save();
    res.json({ message: "Bookmark removed", bookmarkedJobs: user.bookmarkedJobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove bookmark" });
  }
};

// GET /api/users/bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("bookmarkedJobs");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.bookmarkedJobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookmarks" });
  }
};

// GET /api/users/alerts
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await UserAlert.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(50).populate("jobId");
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

// PUT /api/users/alerts/:alertId/read
exports.markAlertRead = async (req, res) => {
  try {
    const alert = await UserAlert.findOneAndUpdate(
      { _id: req.params.alertId, userId: req.userId },
      { isRead: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark alert as read" });
  }
};

// PUT /api/users/alerts/read-all
exports.markAllAlertsRead = async (req, res) => {
  try {
    await UserAlert.updateMany({ userId: req.userId, isRead: false }, { isRead: true });
    res.json({ message: "All alerts marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark alerts as read" });
  }
};

// GET /api/users/alerts/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await UserAlert.countDocuments({ userId: req.userId, isRead: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to get unread count" });
  }
};
