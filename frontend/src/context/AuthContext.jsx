import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const api = axios.create({ baseURL: '' });

const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
    delete axios.defaults.headers.common.Authorization;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('greenlight-token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    setAuthHeader(storedToken);

    api
      .get('/api/auth/profile')
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('greenlight-token');
        setToken(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: authToken, user: userData } = response.data;
      window.localStorage.setItem('greenlight-token', authToken);
      setAuthHeader(authToken);
      setToken(authToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ username, email, password, growingZone, heatZone }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
        growingZone,
        heatZone,
      });
      const { token: authToken, user: userData } = response.data;
      window.localStorage.setItem('greenlight-token', authToken);
      setAuthHeader(authToken);
      setToken(authToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await api.get('/api/auth/profile');
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      return null;
    }
  };

  const logout = () => {
    window.localStorage.removeItem('greenlight-token');
    setAuthHeader(null);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, error, login, register, logout, setError, refreshProfile }),
    [user, token, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
