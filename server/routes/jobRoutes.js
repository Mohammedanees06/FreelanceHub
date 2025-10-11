// routes/jobRoutes.js
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes (require authentication)
router.use(protect);

// Employer routes (require authentication + employer/admin role)
router.get('/employer/my-jobs', authorize('employer', 'admin'), getMyJobs);
router.post('/', authorize('employer', 'admin'), createJob);
router.put('/:id', authorize('employer', 'admin'), updateJob);
router.delete('/:id', authorize('employer', 'admin'), deleteJob);

export default router;