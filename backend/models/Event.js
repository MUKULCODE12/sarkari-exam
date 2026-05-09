const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  type: String, // 'exam', 'result', 'admit', 'application'
  color: String
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
