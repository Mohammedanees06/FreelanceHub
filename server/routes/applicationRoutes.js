import express from "express";
import { 
  applyToJob, 
  getJobApplications, 
  updateApplicationStatus,
  getMyApplications,
  getEmployerApplications,
  withdrawApplication
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/employer', protect, getEmployerApplications);
router.get("/my", protect, getMyApplications);                          
router.post("/:jobId/apply", protect, applyToJob);                      
router.get("/:jobId", protect, getJobApplications);                     
router.patch("/:applicationId/status", protect, updateApplicationStatus); 
router.delete("/:applicationId", protect, withdrawApplication);

export default router;