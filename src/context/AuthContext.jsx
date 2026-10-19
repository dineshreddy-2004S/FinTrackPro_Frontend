import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session state on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser && storedToken !== 'undefined' && storedUser !== 'undefined') {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Clean up corrupted storage keys
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('[Auth Init Error]:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 1. User Login Handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      const { token: receivedToken, user: userData } = response.data;

      if (!receivedToken || !userData) {
        throw new Error('Authentication response missing credentials.');
      }

      // Synchronize in-memory and local storage
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(receivedToken);
      setUser(userData);

      return response.data;
    } catch (error) {
      console.error('[Login Service Error]:', error);
      throw error;
    }
  };

  // 2. User Register Handler
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const { token: receivedToken, user: userData } = response.data;

      if (!receivedToken || !userData) {
        throw new Error('Registration response missing credentials.');
      }

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(receivedToken);
      setUser(userData);

      return response.data;
    } catch (error) {
      console.error('[Register Service Error]:', error);
      throw error;
    }
  };

  // 3. User Logout Handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/auth?mode=login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;