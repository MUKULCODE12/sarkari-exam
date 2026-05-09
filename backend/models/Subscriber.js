const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  channels: {
    type: [String],
    enum: ["email", "whatsapp"],
    default: []
  },
  trackedExams: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  remindersSent: [{
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    daysBeforeDeadline: Number,
    sentAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Compound index: one subscription per email/phone combo
subscriberSchema.index({ email: 1, phone: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Subscriber", subscriberSchema);
