import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc    Apply to a job
// @route   POST /api/applications/:jobId/apply
// @access  Private (Freelancer only)
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { proposal, bid } = req.body;

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can apply to jobs" });
    }

    if (!proposal || !bid) {
      return res.status(400).json({ message: "Please provide proposal and bid amount" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      freelancer: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      freelancer: req.user._id,
      proposal,
      bid
    });

    job.applicants.push(application._id);
    await job.save();

    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title budget')
      .populate('freelancer', 'name email');

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: populatedApplication
    });

  } catch (error) {
    console.error(" Apply to Job Error:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }
    
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Get freelancer's own applications
// @route   GET /api/applications/my
// @access  Private (Freelancer only)
export const getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Access denied. Freelancers only." });
    }

    const { status } = req.query;

    const query = { freelancer: req.user._id };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('job', 'title description skills budget status')
      .populate({
        path: 'job',
        populate: {
          path: 'employer',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    const validApplications = applications.filter(app => app.job !== null);

   
    const formattedApplications = validApplications.map(app => ({
      _id: app._id,
      jobId: app.job._id,
      jobTitle: app.job.title,
      jobDescription: app.job.description,
      jobSkills: app.job.skills,
      jobBudget: app.job.budget,
      jobStatus: app.job.status,
      employerId: app.job.employer._id,  
      employerName: app.job.employer.name, 
      employerEmail: app.job.employer.email,
      proposal: app.proposal,
      bid: app.bid,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      job: app.job,
      freelancer: app.freelancer
    }));

    res.json({
      success: true,
      count: formattedApplications.length,
      applications: formattedApplications
    });
  } catch (error) {
    console.error("❌ Get My Applications Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Get all applications for employer's jobs
// @route   GET /api/applications/employer
// @access  Private (Employer only)
export const getEmployerApplications = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: "Access denied. Employers only." });
    }

    const { status, jobId } = req.query;

    const jobs = await Job.find({ employer: req.user._id });
    const jobIds = jobs.map(job => job._id);

    const query = { job: { $in: jobIds } };
    if (status) {
      query.status = status;
    }
    if (jobId) {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate('job', 'title budget status')
      .populate('freelancer', 'name email skills')
      .sort({ createdAt: -1 });

    const formattedApplications = applications.map(app => ({
      _id: app._id,
      jobId: app.job._id,
      jobTitle: app.job.title,
      jobBudget: app.job.budget,
      jobStatus: app.job.status,
      freelancerId: app.freelancer._id, 
      freelancerName: app.freelancer.name, 
      freelancerEmail: app.freelancer.email,
      freelancerSkills: app.freelancer.skills,
      proposal: app.proposal,
      bid: app.bid,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      job: app.job,
      freelancer: app.freelancer
    }));

    res.json({
      success: true,
      count: formattedApplications.length,
      applications: formattedApplications
    });
  } catch (error) {
    console.error(" Get Employer Applications Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/:jobId
// @access  Private (Employer - job owner only)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const applications = await Application.find({ job: jobId })
      .populate('freelancer', 'name email skills')
      .sort({ createdAt: -1 });

  
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      freelancerId: app.freelancer._id,
      freelancerName: app.freelancer.name,
      freelancerEmail: app.freelancer.email,
      freelancerSkills: app.freelancer.skills,
      proposal: app.proposal,
      bid: app.bid,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      freelancer: app.freelancer
    }));

    res.json({
      success: true,
      count: formattedApplications.length,
      applications: formattedApplications
    });
  } catch (error) {
    console.error(" Get Job Applications Error:", error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:applicationId/status
// @access  Private (Employer - job owner only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'shortlisted', 'accepted', 'rejected', 'hired'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be one of: " + validStatuses.join(', ')
      });
    }

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    if (status === 'hired') {
      const job = await Job.findById(application.job._id);
      if (job && job.status === 'open') {
        job.status = 'in-progress';
        await job.save();
      }
    }

    const updatedApplication = await Application.findById(applicationId)
      .populate('job', 'title budget')
      .populate('freelancer', 'name email');

    res.json({
      success: true,
      message: "Application status updated successfully",
      application: updatedApplication
    });
  } catch (error) {
    console.error("❌ Update Application Status Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:applicationId
// @access  Private (Freelancer only)
export const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (application.status === 'hired') {
      return res.status(400).json({ message: "Cannot withdraw hired application" });
    }

    await Job.findByIdAndUpdate(application.job, {
      $pull: { applicants: applicationId }
    });

    await application.deleteOne();

    res.json({
      success: true,
      message: "Application withdrawn successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};