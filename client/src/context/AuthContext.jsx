import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('quiz_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setTokenState] = useState(() => localStorage.getItem('quiz_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await api.getProfile();
        setUser(profile.user);
        localStorage.setItem('quiz_user', JSON.stringify(profile.user));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setTokenState(data.token);
    setAuthToken(data.token);
    setUser(data.user);
    localStorage.setItem('quiz_user', JSON.stringify(data.user));
    return data;
  };

  const register = async (name, email, password) => {
    const data = await api.register(name, email, password);
    setTokenState(data.token);
    setAuthToken(data.token);
    setUser(data.user);
    localStorage.setItem('quiz_user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setTokenState(null);
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('quiz_user');
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
