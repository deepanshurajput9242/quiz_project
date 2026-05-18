import asyncHandler from 'express-async-handler';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Teacher
const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, timeLimit, questions } = req.body;

  const quiz = new Quiz({
    title,
    description,
    timeLimit,
    teacher: req.user._id,
    isPublished: true,
  });

  if (questions && questions.length > 0) {
    const questionIds = [];
    for (const q of questions) {
      const question = await Question.create({
        ...q
      });
      questionIds.push(question._id);
    }
    quiz.questions = questionIds;
  }

  const createdQuiz = await quiz.save();
  res.status(201).json(createdQuiz);
});

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = asyncHandler(async (req, res) => {
  let query = {};
  
  // If student, only show published quizzes
  if (req.user.role === 'student') {
    query.isPublished = true;
  } else if (req.user.role === 'teacher') {
    // If teacher, show their own quizzes
    query.teacher = req.user._id;
  }
  // Admin sees all (or can filter)

  const quizzes = await Quiz.find(query).populate('teacher', 'username');
  res.json(quizzes);
});

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id)
    .populate('teacher', 'username')
    .populate('questions');

  if (quiz) {
    // Check if student can access (must be published)
    if (req.user.role === 'student' && !quiz.isPublished) {
      res.status(403);
      throw new Error('Quiz not published');
    }
    res.json(quiz);
  } else {
    res.status(404);
    throw new Error('Quiz not found');
  }
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Teacher
const updateQuiz = asyncHandler(async (req, res) => {
  const { title, description, timeLimit, isPublished, questions } = req.body;

  const quiz = await Quiz.findById(req.params.id);

  if (quiz) {
    // Check ownership
    if (quiz.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this quiz');
    }

    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.timeLimit = timeLimit || quiz.timeLimit;
    if (isPublished !== undefined) quiz.isPublished = isPublished;

    if (questions) {
      const questionIds = [];
      for (const q of questions) {
        if (q._id) {
          // Update existing question
          await Question.findByIdAndUpdate(q._id, q);
          questionIds.push(q._id);
        } else {
          // Create new question
          const newQuestion = await Question.create(q);
          questionIds.push(newQuestion._id);
        }
      }
      quiz.questions = questionIds;
    }

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } else {
    res.status(404);
    throw new Error('Quiz not found');
  }
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Teacher
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (quiz) {
    if (quiz.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this quiz');
    }

    await quiz.deleteOne();
    res.json({ message: 'Quiz removed' });
  } else {
    res.status(404);
    throw new Error('Quiz not found');
  }
});

// @desc    Add question to quiz
// @route   POST /api/quizzes/:id/questions
// @access  Private/Teacher
const addQuestion = asyncHandler(async (req, res) => {
  const { text, type, options, correctAnswer, points } = req.body;
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  if (quiz.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to add questions to this quiz');
  }

  const question = new Question({
    text,
    type,
    options,
    correctAnswer,
    points
  });

  const createdQuestion = await question.save();
  quiz.questions.push(createdQuestion._id);
  await quiz.save();

  res.status(201).json(createdQuestion);
});

export {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addQuestion
};
