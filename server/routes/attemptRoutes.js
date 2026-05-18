import express from 'express';
import {
  startAttempt,
  submitAttempt,
  getMyAttempts,
  getAttemptById,
  getTeacherAnalytics
} from '../controllers/attemptController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-attempts', protect, getMyAttempts);
router.get('/teacher-analytics', protect, authorize('teacher'), getTeacherAnalytics);
router.post('/:quizId/start', protect, startAttempt);
router.post('/:id/submit', protect, submitAttempt);
router.get('/:id', protect, getAttemptById);

export default router;
