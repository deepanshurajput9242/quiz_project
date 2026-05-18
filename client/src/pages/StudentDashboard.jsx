import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Clock, BookOpen, Trophy, History, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/quizzes').then(res => setQuizzes(res.data));
    api.get('/attempts/my-attempts').then(res => setAttempts(res.data));
  }, []);

  const totalQuizzes = attempts.length;
  const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
  const bestScore = attempts.reduce((max, curr) => Math.max(max, curr.score), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">Q</div>
            <span className="font-bold text-lg">Student Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-12">
        
        {/* Progress Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" /> Your Progress
            </h2>
            <p className="text-muted-foreground">Keep track of your learning journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium opacity-90">Total Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{totalQuizzes}</div>
                <p className="text-sm opacity-75 mt-1">Quizzes completed</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{averageScore}</div>
                <p className="text-sm text-muted-foreground mt-1">Points per quiz</p>
              </CardContent>
            </Card>

            <Card className="bg-white border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground">Best Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">{bestScore}</div>
                <p className="text-sm text-muted-foreground mt-1">Highest achievement</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Available Quizzes */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" /> Available Quizzes
            </h2>
            <p className="text-muted-foreground">Select a quiz to start testing your knowledge.</p>
          </div>

          {quizzes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed">
              <p className="text-muted-foreground">No quizzes available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map(quiz => (
                <Card key={quiz._id} className="hover:shadow-lg transition-shadow border-t-4 border-t-primary">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
                    <CardDescription className="line-clamp-2 h-10">
                      {quiz.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {quiz.timeLimit} mins
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {quiz.questions?.length || 0} Qs
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/quiz/${quiz._id}`} className="w-full">
                      <Button className="w-full">Start Quiz</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Past Attempts */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
              <History className="w-6 h-6 text-primary" /> Recent Activity
            </h2>
            <p className="text-muted-foreground">View your past quiz results and performance.</p>
          </div>

          {attempts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed">
              <p className="text-muted-foreground">You haven't taken any quizzes yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-muted-foreground font-medium border-b">
                    <tr>
                      <th className="px-6 py-4">Quiz Title</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {attempts.map(attempt => (
                      <tr key={attempt._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-medium">{attempt.quiz?.title || 'Deleted Quiz'}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(attempt.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-primary">{attempt.score} pts</td>
                        <td className="px-6 py-4">
                          <Badge variant={attempt.status === 'completed' ? 'default' : 'secondary'}>
                            {attempt.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/results/${attempt._id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              View Results <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
