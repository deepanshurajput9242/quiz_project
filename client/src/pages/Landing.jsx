import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import BentoGrid from '@/components/BentoGrid';
import Footer from '@/components/Footer';

export default function Landing() {
  const { user } = useAuth();

  if (user) {
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === 'student') return <Navigate to="/dashboard" replace />;
    // If role is unknown or admin (and not handled), stay on landing or show error
    // For now, let's just log it and maybe allow them to see the landing page or logout
    console.warn("Unknown role or admin on landing page:", user.role);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-lg">Q</div>
          <span className="text-xl font-bold tracking-tight">QuizMaster</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4"
        >
          <Link to="/login">
            <Button variant="ghost" className="text-base hover:bg-purple-50">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="text-base px-6 shadow-md hover:shadow-lg transition-all">Get Started</Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 relative">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-200/30 rounded-full blur-3xl -z-10 animate-pulse" />
        
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            Master Your Knowledge with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">QuizMaster</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            The ultimate platform for teachers to assess and students to excel. 
            Create, take, and analyze quizzes with a beautiful, intuitive interface.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex items-center justify-center gap-4 pt-8"
          >
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-gradient-to-r from-purple-600 to-blue-600 border-0">
                Start Learning Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-purple-50">
                I'm a Teacher
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <BentoGrid />

      </main>

      <Footer />
    </div>
  );
}
