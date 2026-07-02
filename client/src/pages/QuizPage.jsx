import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function QuizPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizData = await api.getQuizById(quizId);
        const questionsData = await api.getQuestionsByQuizId(quizId);
        setQuiz(quizData.quiz);
        setQuestions(questionsData.questions || []);
      } catch (err) {
        setError(err.message || 'Unable to load quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  const handleAnswer = (questionId, selectedAnswer) => {
    setAnswers((current) => ({ ...current, [questionId]: selectedAnswer }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        quiz_id: Number(quizId),
        answers: Object.entries(answers).map(([question_id, selected_answer]) => ({
          question_id: Number(question_id),
          selected_answer: Number(selected_answer),
        })),
      };

      const result = await api.submitQuiz(payload);
      navigate(`/results/${result.attemptId}`);
    } catch (err) {
      setError(err.message || 'Unable to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const goNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((index) => index + 1);
    }
  };

  const goPrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((index) => index - 1);
    }
  };

  if (loading) {
    return <div className="page-shell"><p>Loading quiz...</p></div>;
  }

  return (
    <div className="page-shell quiz-page">
      <div className="panel-card">
        <div className="quiz-header">
          <div>
            <p className="eyebrow">Active quiz</p>
            <h1>{quiz?.title}</h1>
            <p>{quiz?.description}</p>
          </div>
          <div className="quiz-meta">
            <span>{questions.length} questions</span>
            <span>{answeredCount} answered</span>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        {currentQuestion && (
          <div className="question-card">
            <h3>{currentQuestionIndex + 1}. {currentQuestion.question}</h3>
            <div className="options-grid">
              {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map((option, optionIndex) => (
                <button
                  key={`${currentQuestion.id}-${optionIndex}`}
                  type="button"
                  className={`option-btn ${answers[currentQuestion.id] === optionIndex + 1 ? 'selected' : ''}`}
                  onClick={() => handleAnswer(currentQuestion.id, optionIndex + 1)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="actions-row">
          <button type="button" className="secondary-btn" onClick={goPrevious} disabled={isFirstQuestion}>
            Back
          </button>
          {isLastQuestion ? (
            <button type="button" className="primary-btn" onClick={handleSubmit} disabled={submitting || answeredCount < questions.length}>
              {submitting ? 'Submitting...' : 'Submit quiz'}
            </button>
          ) : (
            <button type="button" className="primary-btn" onClick={goNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
