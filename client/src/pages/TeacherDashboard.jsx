import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, BarChart2, Trash2, Clock, FileText, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/quizzes').then(res => setQuizzes(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await api.delete(`/quizzes/${id}`);
        setQuizzes(quizzes.filter(q => q._id !== id));
      } catch (error) {
        console.error(error);
        alert('Failed to delete quiz');
      }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white pb-32">
        <header className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner">Q</div>
            <span className="font-bold text-xl tracking-tight">Teacher Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              {user?.username}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 pt-12 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back!</h1>
              <p className="text-indigo-100 text-lg max-w-2xl">
                Manage your quizzes, track student progress, and create engaging learning experiences.
              </p>
            </motion.div>
            
            <div className="flex gap-4">
              <Link to="/teacher/analytics">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <BarChart2 className="w-5 h-5" /> Analytics
                </Button>
              </Link>
              <Link to="/teacher/create-quiz">
                <Button 
                  size="lg" 
                  className="gap-2 bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5" /> Create Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 -mt-24 pb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              Your Quizzes
              <span className="text-sm font-normal text-muted-foreground ml-2 bg-gray-100 px-2 py-1 rounded-full">
                {quizzes.length}
              </span>
            </h2>
          </div>

          {quizzes.length === 0 ? (
            <div className="text-center py-24 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Get started by creating your first quiz. It only takes a few minutes to set up.
              </p>
              <Link to="/teacher/create-quiz">
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4" /> Create First Quiz
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map(quiz => (
                <Card key={quiz._id} className="hover:shadow-lg transition-all duration-300 group border-gray-200/60 hover:border-indigo-200 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="line-clamp-1 text-lg group-hover:text-indigo-600 transition-colors">
                        {quiz.title}
                      </CardTitle>
                      <Badge 
                        variant={quiz.isPublished ? "default" : "secondary"}
                        className={quiz.isPublished ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {quiz.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 h-10 text-sm">
                      {quiz.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        {quiz.timeLimit}m
                      </div>
                      <div className="w-px h-4 bg-gray-300" />
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        {quiz.questions?.length || 0} Qs
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-3 pt-3">
                    <Link to={`/teacher/edit-quiz/${quiz._id}`} className="w-full">
                      <Button variant="outline" className="w-full gap-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200" 
                      onClick={() => handleDelete(quiz._id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
