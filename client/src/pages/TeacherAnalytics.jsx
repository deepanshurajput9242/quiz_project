import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, FileText, TrendingUp, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TeacherAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/attempts/teacher-analytics');
        setData(data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">Failed to load data.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/teacher/dashboard">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Class Analytics</h1>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Active learners</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalAttempts}</div>
              <p className="text-xs text-muted-foreground">Quizzes taken</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.averageScore}</div>
              <p className="text-xs text-muted-foreground">Across all quizzes</p>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quiz Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.quizStats.map((quiz, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{quiz.title}</span>
                    <span className="text-muted-foreground">{quiz.averageScore} avg score</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(quiz.averageScore * 10, 100)}%` }} // Assuming max score is around 10, scale to %
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-primary" 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{quiz.attempts} attempts</p>
                </div>
              ))}
              {data.quizStats.length === 0 && <p className="text-muted-foreground text-sm">No quiz data available.</p>}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((attempt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                        {attempt.user?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{attempt.user?.username || 'Unknown User'}</p>
                        <p className="text-xs text-muted-foreground">{attempt.quiz?.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold block">{attempt.score} pts</span>
                      <span className="text-xs text-muted-foreground">{new Date(attempt.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {data.recentActivity.length === 0 && <p className="text-muted-foreground text-sm">No recent activity.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
