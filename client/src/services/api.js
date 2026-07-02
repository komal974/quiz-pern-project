const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let authToken = localStorage.getItem('quiz_token');

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('quiz_token', token);
  } else {
    localStorage.removeItem('quiz_token');
  }
};

const request = async (path, options = {}) => {
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? (options.body instanceof FormData ? options.body : JSON.stringify(options.body)) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json().catch(() => ({})) : await response.text();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }

  return data;
};

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
  getProfile: () => request('/auth/profile'),
  getQuizzes: () => request('/quizzes'),
  getQuizById: (id) => request(`/quizzes/${id}`),
  createQuiz: (payload) => request('/quizzes', { method: 'POST', body: payload }),
  updateQuiz: (id, payload) => request(`/quizzes/${id}`, { method: 'PUT', body: payload }),
  deleteQuiz: (id) => request(`/quizzes/${id}`, { method: 'DELETE' }),
  getQuestionsByQuizId: (quizId) => request(`/questions/quiz/${quizId}`),
  createQuestion: (payload) => request('/questions', { method: 'POST', body: payload }),
  deleteQuestion: (id) => request(`/questions/${id}`, { method: 'DELETE' }),
  submitQuiz: (payload) => request('/results/submit', { method: 'POST', body: payload }),
  getResults: () => request('/results'),
  getResultById: (id) => request(`/results/${id}`),
};
