import { Link } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <div className="page-shell">
      <section className="hero-panel welcome-panel">
        <div>
          <p className="eyebrow">Welcome to QuizHub</p>
          <h1>Challenge yourself with smart quizzes</h1>
          <p>Create an account or sign in to explore quizzes, track your score, and review your results.</p>
        </div>

        <div className="hero-actions">
          <Link to="/register" className="primary-btn">Register</Link>
          <Link to="/auth" className="secondary-btn">Login</Link>
        </div>
      </section>
    </div>
  );
}
