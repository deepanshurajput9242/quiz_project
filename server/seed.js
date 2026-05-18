import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Quiz from './models/Quiz.js';
import Question from './models/Question.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Quiz.deleteMany({});
    await Question.deleteMany({});

    // Create Users
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const teacher = await User.create({
      username: 'teacher',
      email: 'teacher@example.com',
      password: 'password123',
      role: 'teacher'
    });

    const student = await User.create({
      username: 'student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student'
    });

    console.log('Users created');

    // Create Questions
    const q1 = await Question.create({
      text: 'What is the capital of France?',
      type: 'mcq',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris',
      points: 5
    });

    const q2 = await Question.create({
      text: 'Which planet is known as the Red Planet?',
      type: 'mcq',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars',
      points: 5
    });

    console.log('Questions created');

    // Create Quiz
    await Quiz.create({
      title: 'General Knowledge Quiz',
      description: 'A simple quiz to test your general knowledge.',
      teacher: teacher._id,
      timeLimit: 10,
      questions: [q1._id, q2._id],
      isPublished: true
    });

    console.log('Quiz created');

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
