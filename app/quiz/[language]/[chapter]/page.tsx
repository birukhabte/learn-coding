'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { saveQuizAttempt } from '@/lib/quizService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  Loader2,
  Home,
  SkipForward
} from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  id: string;
  language: string;
  chapter: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const language = params.language as string;
  const chapter = params.chapter as string;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load quiz data from /data folder
  useEffect(() => {
    const loadQuiz = async () => {
      if (!language || !chapter) return;

      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`/data/${language}/${chapter}.json`);
        
        if (!response.ok) {
          throw new Error(`Quiz not found: /data/${language}/${chapter}.json`);
        }
        
        const data = await response.json();
        console.log('Quiz loaded:', data);
        
        setQuizData(data);
        setSelectedAnswers(new Array(data.questions.length).fill(-1));
        setLoading(false);
      } catch (error) {
        console.error('Error loading quiz:', error);
        setError(`Failed to load quiz. Make sure /public/data/${language}/${chapter}.json exists.`);
        setLoading(false);
      }
    };

    if (language && chapter) {
      loadQuiz();
    }
  }, [language, chapter]);

  // Timer
  useEffect(() => {
    if (!showResults && quizData) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - quizStartTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showResults, quizData, quizStartTime]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSkip = () => {
    if (currentQuestion < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quizData || !user || isSubmitting) return;

    setIsSubmitting(true);

    const answeredQuestions = selectedAnswers.filter(answer => answer !== -1).length;
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer !== -1 && answer === quizData.questions[index].correctAnswer
    ).length;

    const wrongAnswers = answeredQuestions - correctAnswers;
    const percentage = answeredQuestions > 0 
      ? Math.round((correctAnswers / quizData.questions.length) * 100) 
      : 0;

    const answers = selectedAnswers.map((selected, index) => ({
      questionId: quizData.questions[index].id,
      selectedAnswer: selected,
      correctAnswer: quizData.questions[index].correctAnswer,
      isCorrect: selected !== -1 && selected === quizData.questions[index].correctAnswer,
    }));

    try {
      await saveQuizAttempt({
        userId: user.uid,
        language: quizData.language,
        chapterId: quizData.id,
        chapterTitle: quizData.title,
        score: correctAnswers,
        totalQuestions: quizData.questions.length,
        correctAnswers,
        wrongAnswers,
        percentage,
        answers,
        timestamp: new Date() as any,
        timeSpent,
      });

      setShowResults(true);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error saving quiz results. But you can still see your results!');
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <Card className="max-w-md w-full border-2 border-black">
          <CardHeader>
            <CardTitle className="text-center text-black">Quiz Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {error || 'The quiz you are looking for does not exist.'}
            </p>
            <div className="space-y-2">
              <Link href={`/${language}-quiz`}>
                <Button variant="outline" className="w-full border-2 border-black">
                  Back to Quiz List
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const answeredCount = selectedAnswers.filter(answer => answer !== -1).length;
    const correctCount = selectedAnswers.filter(
      (answer, index) => answer !== -1 && answer === quizData.questions[index].correctAnswer
    ).length;
    const wrongCount = answeredCount - correctCount;
    const skippedCount = quizData.questions.length - answeredCount;
    const percentage = answeredCount > 0 
      ? Math.round((correctCount / quizData.questions.length) * 100) 
      : 0;

    return (
      <div className="min-h-screen bg-white py-4 sm:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-black">
            <CardHeader className="bg-black text-white">
              <CardTitle className="text-xl sm:text-2xl text-center">Quiz Results</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-black text-3xl sm:text-4xl font-bold mb-4">
                  {percentage}%
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-black">{quizData.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">Time: {formatTime(timeSpent)}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
                <div className="text-center p-3 sm:p-4 border-2 border-black rounded">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Score</p>
                  <p className="text-xl sm:text-3xl font-bold text-black">{correctCount}/{quizData.questions.length}</p>
                </div>
                <div className="text-center p-3 sm:p-4 border-2 border-black rounded">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Correct</p>
                  <p className="text-xl sm:text-3xl font-bold text-green-600">{correctCount}</p>
                </div>
                <div className="text-center p-3 sm:p-4 border-2 border-black rounded">
                  <XCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-red-600" />
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Wrong</p>
                  <p className="text-xl sm:text-3xl font-bold text-red-600">{wrongCount}</p>
                </div>
                <div className="text-center p-3 sm:p-4 border-2 border-black rounded">
                  <SkipForward className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Skipped</p>
                  <p className="text-xl sm:text-3xl font-bold text-gray-600">{skippedCount}</p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <h4 className="font-bold text-base sm:text-lg text-black">Review Answers</h4>
                {quizData.questions.map((question, index) => {
                  const isSkipped = selectedAnswers[index] === -1;
                  const isCorrect = !isSkipped && selectedAnswers[index] === question.correctAnswer;
                  
                  return (
                    <Card key={question.id} className={`border-2 ${
                      isSkipped ? 'border-gray-400 bg-gray-50' :
                      isCorrect ? 'border-green-600 bg-green-50' : 
                      'border-red-600 bg-red-50'
                    }`}>
                      <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                        <div className="flex items-start gap-2 sm:gap-3 mb-3">
                          {isSkipped ? (
                            <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0 mt-1" />
                          ) : isCorrect ? (
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
                          ) : (
                            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold mb-3 text-black text-sm sm:text-base">{index + 1}. {question.question}</p>
                            <div className="space-y-2 text-xs sm:text-sm">
                              <p>
                                <span className="font-semibold text-black">Your answer:</span>{' '}
                                <span className={
                                  isSkipped ? 'text-gray-600 font-medium italic' :
                                  isCorrect ? 'text-green-700 font-medium' : 
                                  'text-red-700 font-medium'
                                }>
                                  {isSkipped ? 'Skipped' : question.options[selectedAnswers[index]]}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p>
                                  <span className="font-semibold text-black">Correct answer:</span>{' '}
                                  <span className="text-green-700 font-medium">{question.options[question.correctAnswer]}</span>
                                </p>
                              )}
                              <p className="text-gray-700 bg-white p-2 sm:p-3 rounded border border-gray-300">
                                <span className="font-semibold text-black">Explanation:</span> {question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href={`/${language}-quiz`} className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full border-2 border-black text-black hover:bg-black hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Quizzes
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const answeredCount = selectedAnswers.filter(answer => answer !== -1).length;

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
          <Link href={`/${language}-quiz`}>
            <Button variant="outline" size="sm" className="border-2 border-black text-black hover:bg-black hover:text-white text-xs sm:text-sm">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Exit
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-black">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-mono font-bold text-base sm:text-lg">{formatTime(timeSpent)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold text-black">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
            <span className="text-xs sm:text-sm font-bold text-black">
              {answeredCount} Answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 border-2 border-black">
            <div 
              className="bg-black h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border-2 border-black mb-4 sm:mb-6">
          <CardHeader className="bg-gray-100 border-b-2 border-black p-3 sm:p-6">
            <CardTitle className="text-base sm:text-xl text-black leading-relaxed">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="space-y-2 sm:space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-3 sm:p-4 text-left rounded border-2 transition-all text-sm sm:text-base ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-black bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-white bg-white'
                        : 'border-gray-400'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-black" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation - Mobile Friendly */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            {quizData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-bold border-2 transition-all flex-shrink-0 ${
                  index === currentQuestion
                    ? 'bg-black text-white border-black'
                    : selectedAnswers[index] !== -1
                    ? 'bg-green-100 text-green-800 border-green-600'
                    : 'bg-white text-black border-gray-400 hover:border-black'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-2 border-black text-black hover:bg-black hover:text-white disabled:opacity-50 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={handleSkip}
              disabled={currentQuestion === quizData.questions.length - 1}
              variant="outline"
              className="flex-1 sm:flex-none border-2 border-gray-400 text-gray-700 hover:bg-gray-100 disabled:opacity-50 text-sm sm:text-base"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>

            {currentQuestion === quizData.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none bg-black hover:bg-gray-800 text-white disabled:opacity-50 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Quiz'
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 sm:flex-none bg-black hover:bg-gray-800 text-white text-sm sm:text-base"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}