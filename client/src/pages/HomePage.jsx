import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function HomePage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await api.getQuizzes();
        setQuizzes(data.quizzes || []);
      } catch (err) {
        setError(err.message || 'Unable to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Quiz platform</p>
          <h1>Welcome back, {user?.name || 'learner'}!</h1>
          <p>Pick a quiz, answer every question, and review your results in one place.</p>
        </div>
        <div className="hero-actions">
          <Link to="/quizzes" className="primary-btn">Browse quizzes</Link>
          <Link to="/results" className="secondary-btn">View results</Link>
          {user?.role === 'admin' && <Link to="/admin" className="secondary-btn">Manage quizzes</Link>}
        </div>
      </section>

      <section className="card-grid">
        <div className="panel-card">
          <h2>Available quizzes</h2>
          {loading && <p>Loading quizzes...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && quizzes.length === 0 && <p>No quizzes are available right now.</p>}

          <div className="quiz-list">
            {quizzes.map((quiz) => (
              <article key={quiz.id} className="quiz-card">
                <div>
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description || 'A fun challenge for students and learners.'}</p>
                  <small>Duration: {quiz.duration || 10} mins</small>
                </div>
                <Link to={`/quiz/${quiz.id}`} className="primary-btn">Start quiz</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
