import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a job title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a job description"],
  },
  skills: {
    type: [String],
    required: [true, "Please add required skills"],
  },
  budget: {
    type: Number,
    required: [true, "Please add a budget"],
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Keep ONLY a reference array for quick counts
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application" // Reference to Application model
    }
  ],
  status: {
    type: String,
    enum: ["open", "in-progress", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for applicant count
jobSchema.virtual('applicantCount').get(function() {
  return this.applicants.length;
});

const Job = mongoose.model("Job", jobSchema);

export default Job;