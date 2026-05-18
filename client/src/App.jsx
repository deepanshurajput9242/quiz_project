import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import QuizPage from './pages/QuizPage';
import CreateQuiz from './pages/CreateQuiz';
import Results from './pages/Results';
import Landing from './pages/Landing';
import TeacherAnalytics from './pages/TeacherAnalytics'; // Added import

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/results/:id" element={<Results />} />
      </Route>

      {/* Teacher Routes */}
      <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
        <Route path="/teacher/edit-quiz/:id" element={<CreateQuiz />} /> {/* Reuse Create for Edit */}
        <Route path="/teacher/analytics" element={<TeacherAnalytics />} /> {/* Added Teacher Analytics route */}
      </Route>
    </Routes>
  );
}

import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Chatbot />
    </AuthProvider>
  );
}

export default App;
