const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true,
    default: ""
  },
  bookmarkedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  }],
  notifChannels: {
    type: [String],
    enum: ["email", "whatsapp", "inapp"],
    default: ["inapp"]
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
