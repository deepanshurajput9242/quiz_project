import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'true-false', 'short-answer', 'text'],
    default: 'mcq'
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
