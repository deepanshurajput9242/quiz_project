import express from 'express';
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addQuestion
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getQuizzes)
  .post(protect, authorize('teacher', 'admin'), createQuiz);

router.route('/:id')
  .get(protect, getQuizById)
  .put(protect, authorize('teacher', 'admin'), updateQuiz)
  .delete(protect, authorize('teacher', 'admin'), deleteQuiz);

router.route('/:id/questions')
  .post(protect, authorize('teacher', 'admin'), addQuestion);

export default router;
