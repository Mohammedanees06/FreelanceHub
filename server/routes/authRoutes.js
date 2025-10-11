import express from "express";
import { registerUser, loginUser, getMe, updateProfile, changePassword, googleLogin,googleSignup, } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { 
  upload,  
  uploadResume, 
  deleteResume, 
  getResume,
  downloadResume,
  
} from "../controllers/resumeController.js";

const router = express.Router();

// Auth routes
router.post("/register", upload.single('resume'), registerUser);
router.post("/login", loginUser);
router.post('/google-login', googleLogin);
router.post('/google-signup', googleSignup);

// Protected user routes
router.get("/me", protect, getMe);
router.put('/profile', protect, updateProfile); 
router.put('/password', protect, changePassword); 

// Resume routes
router.post('/upload-resume', protect, upload.single('resume'), uploadResume);
router.delete('/delete-resume', protect, deleteResume);
router.get('/resume', protect, getResume);
router.get('/download-resume', protect, downloadResume);

export default router;