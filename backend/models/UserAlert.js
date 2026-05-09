const mongoose = require("mongoose");

const userAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  alertType: {
    type: String,
    enum: ["result_released", "admit_card_released", "answer_key_released", "new_job", "deadline_reminder"],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

userAlertSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("UserAlert", userAlertSchema);
