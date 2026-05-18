import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const initQuiz = async () => {
      try {
        const { data: quizData } = await api.get(`/quizzes/${id}`);
        setQuiz(quizData);
        setTimeLeft(quizData.timeLimit * 60);

        const { data: attemptData } = await api.post(`/attempts/${id}/start`);
        setAttemptId(attemptData._id);
        
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Failed to load quiz");
        navigate('/dashboard');
      }
    };

    initQuiz();
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, timeLeft]);

  useEffect(() => {
    if (attemptId) {
      localStorage.setItem(`quiz_answers_${attemptId}`, JSON.stringify(answers));
    }
  }, [answers, attemptId]);

  useEffect(() => {
    if (attemptId) {
      const saved = localStorage.getItem(`quiz_answers_${attemptId}`);
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
    }
  }, [attemptId]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!attemptId) {
      alert("Error: Quiz attempt not initialized properly. Please refresh.");
      return;
    }
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, opt]) => ({
        questionId: qId,
        selectedOption: opt
      }));

      await api.post(`/attempts/${attemptId}/submit`, { answers: formattedAnswers });
      localStorage.removeItem(`quiz_answers_${attemptId}`);
      navigate(`/results/${attemptId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to submit quiz: " + (error.response?.data?.message || error.message));
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sticky Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold text-lg truncate max-w-[200px] sm:max-w-md">{quiz.title}</h1>
          <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {quiz.questions.map((q, index) => (
          <Card key={q._id} className={`transition-all ${answers[q._id] ? 'border-primary/50 shadow-md' : 'hover:shadow-md'}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium leading-relaxed flex gap-4">
                <span className="text-muted-foreground font-bold">Q{index + 1}</span>
                {q.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {q.type === 'mcq' && (
                <RadioGroup
                  value={answers[q._id] || ""}
                  onValueChange={(val) => handleOptionSelect(q._id, val)}
                  className="space-y-3"
                >
                  {q.options.map((opt, i) => (
                    <div key={i} className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${answers[q._id] === opt ? 'bg-primary/5 border-primary' : 'hover:bg-gray-50 border-transparent bg-gray-50/50'}`}>
                      <RadioGroupItem value={opt} id={`${q._id}-${i}`} />
                      <Label htmlFor={`${q._id}-${i}`} className="flex-1 cursor-pointer font-normal text-base">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.type === 'true-false' && (
                <div className="grid grid-cols-2 gap-4">
                  {['True', 'False'].map((opt) => (
                    <Button
                      key={opt}
                      variant={answers[q._id] === opt ? "default" : "outline"}
                      className={`h-16 text-lg ${answers[q._id] === opt ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      onClick={() => handleOptionSelect(q._id, opt)}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              )}

              {q.type === 'short-answer' && (
                <div className="space-y-2">
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Type your answer here..."
                    value={answers[q._id] || ""}
                    onChange={(e) => handleOptionSelect(q._id, e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm sticky bottom-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{answeredCount}</span> of <span className="font-bold text-foreground">{totalQuestions}</span> questions answered
          </div>
          <Button size="lg" onClick={handleSubmit} disabled={submitting} className="px-8">
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </div>
      </main>
    </div>
  );
}
