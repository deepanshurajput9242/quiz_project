import asyncHandler from 'express-async-handler';
import Attempt from '../models/Attempt.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';

// @desc    Start a quiz attempt
// @route   POST /api/attempts/:quizId/start
// @access  Private/Student
const startAttempt = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  if (!quiz.isPublished) {
    res.status(403);
    throw new Error('Quiz is not published');
  }

  // Check if already in progress? Optional.
  // For now allow multiple attempts or check existing.
  
  const attempt = await Attempt.create({
    user: req.user._id,
    quiz: quiz._id,
    startTime: new Date(),
    status: 'in-progress'
  });

  res.status(201).json(attempt);
});

// @desc    Submit quiz attempt
// @route   POST /api/attempts/:id/submit
// @access  Private/Student
const submitAttempt = asyncHandler(async (req, res) => {
  const { answers } = req.body; // Array of { questionId, selectedOption }
  const attempt = await Attempt.findById(req.params.id);

  if (!attempt) {
    res.status(404);
    throw new Error('Attempt not found');
  }

  if (attempt.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (attempt.status === 'completed') {
    res.status(400);
    throw new Error('Attempt already submitted');
  }

  // Calculate score
  let score = 0;
  const quiz = await Quiz.findById(attempt.quiz).populate('questions');
  
  // Map answers to questions
  // We need to fetch questions to check correct answers
  // quiz.questions contains the question objects if populated
  
  const processedAnswers = [];

  for (const answer of answers) {
    const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
    
    if (question) {
      processedAnswers.push({
        questionId: question._id,
        selectedOption: answer.selectedOption
      });

      if (question.correctAnswer === answer.selectedOption) {
        score += question.points;
      }
    }
  }

  attempt.answers = processedAnswers;
  attempt.score = score;
  attempt.status = 'completed';
  attempt.endTime = new Date();

  await attempt.save();

  res.json(attempt);
});

// @desc    Get my attempts
// @route   GET /api/attempts/my-attempts
// @access  Private/Student
const getMyAttempts = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ user: req.user._id })
    .populate('quiz', 'title')
    .sort('-createdAt');
  res.json(attempts);
});

// @desc    Get attempt by ID
// @route   GET /api/attempts/:id
// @access  Private
const getAttemptById = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.id)
    .populate('quiz', 'title')
    .populate('user', 'username')
    .populate({
      path: 'answers.questionId',
      select: 'text options correctAnswer points'
    });

  if (!attempt) {
    res.status(404);
    throw new Error('Attempt not found');
  }

  // Allow student to see own attempt, or teacher/admin
  if (attempt.user._id.toString() !== req.user._id.toString() && req.user.role === 'student') {
    res.status(403);
    throw new Error('Not authorized');
  }
  
  // If teacher, check if they own the quiz
  if (req.user.role === 'teacher') {
    const quiz = await Quiz.findById(attempt.quiz);
    if (quiz.teacher.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }
  }

  res.json(attempt);
});

// @desc    Get teacher analytics
// @route   GET /api/attempts/teacher-analytics
// @access  Private/Teacher
const getTeacherAnalytics = asyncHandler(async (req, res) => {
  // 1. Get all quizzes created by this teacher
  const quizzes = await Quiz.find({ teacher: req.user._id });
  const quizIds = quizzes.map(q => q._id);

  // 2. Get all attempts for these quizzes
  const attempts = await Attempt.find({ quiz: { $in: quizIds } })
    .populate('user', 'username email')
    .populate('quiz', 'title')
    .sort('-createdAt');

  // 3. Calculate stats
  const totalStudents = new Set(attempts.map(a => a.user._id.toString())).size;
  const totalAttempts = attempts.length;
  
  const averageScore = totalAttempts > 0 
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts) 
    : 0;

  // 4. Per Quiz Stats
  const quizStats = quizzes.map(quiz => {
    const quizAttempts = attempts.filter(a => a.quiz._id.toString() === quiz._id.toString());
    const avg = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / quizAttempts.length)
      : 0;
    return {
      title: quiz.title,
      attempts: quizAttempts.length,
      averageScore: avg
    };
  });

  res.json({
    totalStudents,
    totalAttempts,
    averageScore,
    recentActivity: attempts.slice(0, 10), // Last 10 attempts
    quizStats
  });
});

export {
  startAttempt,
  submitAttempt,
  getMyAttempts,
  getAttemptById,
  getTeacherAnalytics
};
