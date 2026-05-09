const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    category: String, // e.g., 'UR (General)', 'SSC' (mixed usage but okay)
    lastDate: String, // frontend uses string like '15 Jan 2025'
    applyLink: String,
    qualification: String,
    ageLimit: String,
    state: String,
    department: String,
    isTrending: Boolean,
    type: {
      type: String,
      enum: ["Latest Job", "Result", "Admit Card", "Answer Key", "Admission", "Yojana"],
      default: "Latest Job"
    },
    postCount: String,
    sourceUrl: String,
    syllabus: String,
    examPattern: String,
    selectionProcess: String,
    officialNotification: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
