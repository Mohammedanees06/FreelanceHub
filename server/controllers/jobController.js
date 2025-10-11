// controllers/jobController.js
import Job from "../models/Job.js";

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer only)
export const createJob = async (req, res) => {
  try {
    const { title, description, skills, budget } = req.body;

    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    // Validate required fields
    if (!title || !description || !skills || !budget) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      skills,
      budget,
      employer: req.user._id
    });

    const populatedJob = await Job.findById(job._id).populate('employer', 'name email');

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: populatedJob
    });
  } catch (error) {
    console.error("❌ Create Job Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .populate('employer', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error("❌ Get Jobs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email');
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error("❌ Get Job Error:", error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get jobs posted by current employer
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employer only)
export const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: "Access denied. Employers only." });
    }

    const jobs = await Job.find({ employer: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error("❌ Get My Jobs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer - owner only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

 

    // Check ownership OR admin role
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      console.log('❌ Authorization failed!');
      return res.status(403).json({ 
        message: "Not authorized to update this job",
        debug: {
          jobEmployer: job.employer.toString(),
          userId: req.user._id.toString(),
          userRole: req.user.role
        }
      });
    }

    console.log('Authorization passed!');

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employer', 'name email');

    res.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob
    });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check ownership OR admin role
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};