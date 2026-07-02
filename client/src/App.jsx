import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function AppRoutes() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="app-header">
        <div>
          <h2>QuizHub</h2>
          <p>Interactive quizzes for learners and admins</p>
        </div>
        {user ? (
          <nav className="header-nav">
            <a href="/">Home</a>
            <a href="/results">Results</a>
            {user.role === 'admin' && <a href="/admin">Admin</a>}
            <button type="button" className="link-btn" onClick={logout}>Logout</button>
          </nav>
        ) : (
          <nav className="header-nav">
            <a href="/" className="secondary-btn">Welcome</a>
            <a href="/auth" className="secondary-btn">Login</a>
            <a href="/register" className="primary-btn">Register</a>
          </nav>
        )}
      </header>

      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <WelcomePage />} />
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" replace />} />
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/results/:attemptId" element={<ResultsPage />} />
        </Route>
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
