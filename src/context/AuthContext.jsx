import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check auth user status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login action
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const userData = response.data; // response contains { id, email, role }
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || 'Login failed';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Register action
  const register = async (name, email, password, avatar = '', role = 'user') => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
        avatar,
        role,
      });
      const userData = response.data; // response contains { id, name, email, role }
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const errors = error.response?.data?.errors;
      const errorMsg = errors && Array.isArray(errors) && errors.length > 0
        ? errors[0].msg
        : (error.response?.data?.msg || error.response?.data?.message || 'Registration failed');
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout action
  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, register, logout, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
