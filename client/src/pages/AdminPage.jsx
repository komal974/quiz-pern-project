import { useEffect, useState } from 'react';
import { api } from '../services/api';

const emptyQuizForm = { title: '', description: '', duration: 10 };
const emptyQuestionForm = { question: '', option1: '', option2: '', option3: '', option4: '', correct_answer: 1 };

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quizForm, setQuizForm] = useState(emptyQuizForm);
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadQuizzes = async () => {
    try {
      const data = await api.getQuizzes();
      setQuizzes(data.quizzes || []);
      if (!selectedQuizId && (data.quizzes || []).length > 0) {
        setSelectedQuizId(String(data.quizzes[0].id));
      }
    } catch (err) {
      setError(err.message || 'Unable to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!selectedQuizId) return;
      try {
        const data = await api.getQuestionsByQuizId(selectedQuizId);
        setQuestions(data.questions || []);
      } catch (err) {
        setError(err.message || 'Unable to fetch questions');
      }
    };

    loadQuestions();
  }, [selectedQuizId]);

  const handleQuizSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.createQuiz(quizForm);
      setQuizForm(emptyQuizForm);
      await loadQuizzes();
    } catch (err) {
      setError(err.message || 'Unable to create quiz');
    }
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.createQuestion({ ...questionForm, quiz_id: Number(selectedQuizId), correct_answer: Number(questionForm.correct_answer) });
      setQuestionForm(emptyQuestionForm);
      const data = await api.getQuestionsByQuizId(selectedQuizId);
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err.message || 'Unable to create question');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await api.deleteQuestion(questionId);
      const data = await api.getQuestionsByQuizId(selectedQuizId);
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err.message || 'Unable to delete question');
    }
  };

  return (
    <div className="page-shell admin-page">
      <div className="panel-card">
        <h1>Admin dashboard</h1>
        <p>Create quizzes and add questions for learners.</p>
        {error && <p className="error-text">{error}</p>}

        <form className="card-form" onSubmit={handleQuizSubmit}>
          <h2>Create quiz</h2>
          <label>
            <span>Title</span>
            <input value={quizForm.title} onChange={(event) => setQuizForm({ ...quizForm, title: event.target.value })} required />
          </label>
          <label>
            <span>Description</span>
            <textarea value={quizForm.description} onChange={(event) => setQuizForm({ ...quizForm, description: event.target.value })} />
          </label>
          <label>
            <span>Duration (minutes)</span>
            <input type="number" min="1" value={quizForm.duration} onChange={(event) => setQuizForm({ ...quizForm, duration: event.target.value })} required />
          </label>
          <button type="submit" className="primary-btn">Create quiz</button>
        </form>

        {loading ? <p>Loading quizzes...</p> : (
          <div className="admin-section">
            <label>
              <span>Select quiz</span>
              <select value={selectedQuizId} onChange={(event) => setSelectedQuizId(event.target.value)}>
                {quizzes.map((quiz) => <option key={quiz.id} value={quiz.id}>{quiz.title}</option>)}
              </select>
            </label>

            <form className="card-form" onSubmit={handleQuestionSubmit}>
              <h2>Add question</h2>
              <label>
                <span>Question</span>
                <input value={questionForm.question} onChange={(event) => setQuestionForm({ ...questionForm, question: event.target.value })} required />
              </label>
              <div className="options-grid admin-options">
                {[1, 2, 3, 4].map((index) => (
                  <label key={index}>
                    <span>Option {index}</span>
                    <input value={questionForm[`option${index}`]} onChange={(event) => setQuestionForm({ ...questionForm, [`option${index}`]: event.target.value })} required />
                  </label>
                ))}
              </div>
              <label>
                <span>Correct option number</span>
                <input type="number" min="1" max="4" value={questionForm.correct_answer} onChange={(event) => setQuestionForm({ ...questionForm, correct_answer: event.target.value })} required />
              </label>
              <button type="submit" className="primary-btn">Add question</button>
            </form>

            <div className="questions-list">
              {questions.map((question) => (
                <div key={question.id} className="question-card">
                  <h3>{question.question}</h3>
                  <p>{question.option1}</p>
                  <p>{question.option2}</p>
                  <p>{question.option3}</p>
                  <p>{question.option4}</p>
                  <button type="button" className="secondary-btn" onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
