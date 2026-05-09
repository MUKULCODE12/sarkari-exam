const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  timeText: String, // e.g., '2 hours ago'
  type: String, // 'admit', 'result', 'application', 'exam'
  urgent: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
