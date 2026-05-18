import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Home, RotateCcw, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function Results() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await api.get(`/attempts/${id}`);
        setAttempt(data);
        
        // Trigger confetti if score is > 50%
        if (data.score > 0) {
           // ... confetti code ...
           const duration = 3 * 1000;
           const animationEnd = Date.now() + duration;
           const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
           const randomInRange = (min, max) => Math.random() * (max - min) + min;
           const interval = setInterval(function() {
             const timeLeft = animationEnd - Date.now();
             if (timeLeft <= 0) return clearInterval(interval);
             const particleCount = 50 * (timeLeft / duration);
             confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
             confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
           }, 250);
        }

      } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Error Loading Results</h1>
        <p className="text-gray-600">{error}</p>
        <Link to="/dashboard">
          <Button className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );

  if (!attempt) return <div>Results not found</div>;

  // Calculate stats
  const totalQuestions = attempt.answers.length;
  const correctAnswers = attempt.answers.filter(a => a.questionId.correctAnswer === a.selectedOption).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-2xl bg-white/80 backdrop-blur overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500" />
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center p-4 bg-yellow-100 rounded-full mb-4"
              >
                <Trophy className="w-12 h-12 text-yellow-600" />
              </motion.div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Quiz Completed!</h1>
                <p className="text-muted-foreground text-lg">Here is how you performed</p>
              </div>

              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-8">
                <div className="text-center p-4 rounded-2xl bg-purple-50">
                  <div className="text-3xl font-bold text-purple-600">{attempt.score}</div>
                  <div className="text-sm text-purple-600/80 font-medium">Points</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-blue-50">
                  <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
                  <div className="text-sm text-blue-600/80 font-medium">Score</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-green-50">
                  <div className="text-3xl font-bold text-green-600">{correctAnswers}/{totalQuestions}</div>
                  <div className="text-sm text-green-600/80 font-medium">Correct</div>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-8">
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Home className="w-4 h-4" /> Dashboard
                  </Button>
                </Link>
                <Link to={`/quiz/${attempt.quiz._id}`}>
                  <Button size="lg" className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Retry Quiz
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 px-2">Question Breakdown</h2>
          <div className="space-y-4">
            {attempt.answers.map((ans, index) => {
              const isCorrect = ans.questionId.correctAnswer === ans.selectedOption;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                >
                  <Card className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'} overflow-hidden`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-full ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-medium text-lg">{ans.questionId.text}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Answer</span>
                              <p className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                {ans.selectedOption}
                              </p>
                            </div>
                            {!isCorrect && (
                              <div className="space-y-1">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Correct Answer</span>
                                <p className="font-medium text-green-600">
                                  {ans.questionId.correctAnswer}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-muted-foreground">
                          {isCorrect ? `+${ans.questionId.points}` : '0'} pts
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
