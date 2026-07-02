import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form.name, form.email, form.password);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-intro">
        <p className="eyebrow">New account</p>
        <h1>Start your quiz journey</h1>
        <p>Create an account to take quizzes, keep your result history, and unlock admin features when needed.</p>
      </div>

      <form className="card-form" onSubmit={handleSubmit}>
        <label>
          <span>Name</span>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>

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
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="toggle-text">
        Already joined? <Link to="/auth" className="link-btn">Sign in instead</Link>
      </p>
    </div>
  );
}
