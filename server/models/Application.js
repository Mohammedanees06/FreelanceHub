import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    proposal: {
      type: String,
      required: [true, "Please provide a proposal"],
      trim: true,
      minlength: [5, "Proposal must be at least 5 characters"],
      maxlength: [2000, "Proposal cannot exceed 2000 characters"],
    },
    bid: {
      type: Number,
      required: [true, "Please provide a bid amount"],
      min: [0, "Bid amount must be positive"],
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "accepted", "rejected", "hired"],
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index to prevent duplicate applications
applicationSchema.index({ job: 1, freelancer: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;