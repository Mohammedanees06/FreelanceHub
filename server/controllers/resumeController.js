import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";


const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed!'), false);
  }
};

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter, // Add file validation
});

// Upload resume to Cloudinary

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (user.resumePublicId) {
      await cloudinary.uploader.destroy(user.resumePublicId, { 
        resource_type: 'raw'
      });
    }

    // Extract filename info 
    const extension = req.file.originalname.split('.').pop().toLowerCase();
    const fileName = `resume_${user._id}_${Date.now()}.${extension}`; // Added .${extension}

    // Convert buffer to base64 data URI
    const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64File, {
      resource_type: "raw",
      public_id: fileName, 
      folder: "resumes"
     
    });

    // Save to database
    user.resume = result.secure_url;
    user.resumePublicId = result.public_id;
    await user.save();

    res.json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: result.secure_url,
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "Failed to upload resume", 
      error: error.message 
    });
  }
};

// Delete resume
export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.resumePublicId) {
      return res.status(400).json({ message: "No resume to delete" });
    }

    await cloudinary.uploader.destroy(user.resumePublicId, {
      resource_type: 'raw'
    });
    
    user.resume = null;
    user.resumePublicId = null;
    await user.save();

    res.json({ 
      success: true, 
      message: "Resume deleted successfully" 
    });
  } catch (error) {
    console.error("Resume deletion error:", error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

// Get resume URL
export const getResume = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const user = await User.findById(req.user._id).select('resume');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found"
      });
    }

    res.json({
      success: true,
      resume: user.resume
    });

  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve resume"
    });
  }
};

// Download resume 
export const downloadResume = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const user = await User.findById(req.user._id).select('resume resumePublicId');

    if (!user || !user.resumePublicId) {
      return res.status(404).json({
        success: false,
        message: "No resume found"
      });
    }

    // Get file extension
    const extension = user.resumePublicId.split('.').pop() || 'pdf';
    
    // Generates download URL using Cloudinary SDK
    const downloadUrl = cloudinary.url(user.resumePublicId, {
      resource_type: 'raw',
      type: 'upload',
      flags: 'attachment',
      format: extension
    });

    res.json({
      success: true,
      downloadUrl: downloadUrl,
      filename: `resume.${extension}`
    });

  } catch (error) {
    console.error("Download resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download resume"
    });
  }
};