import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', email: '', password: '' };

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-intro">
        <p className="eyebrow">{mode === 'login' ? 'Welcome back' : 'Create account'}</p>
        <h1>{mode === 'login' ? 'Sign in to continue' : 'Start your quiz journey'}</h1>
        <p>
          {mode === 'login'
            ? 'Access your quizzes, resume progress, and revisit your results.'
            : 'Register to begin taking quizzes, review your history, and unlock admin tools.'}
        </p>
      </div>

      <form className="card-form" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <label>
            <span>Name</span>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
        )}

        <label>
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          <span>Password</span>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="toggle-text">
        {mode === 'login' ? "New here?" : 'Already joined?'}{' '}
        <button type="button" className="link-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Create an account' : 'Sign in instead'}
        </button>
      </p>
    </div>
  );
}
