import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './authContext';

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // Check if token exists on app load
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // You can validate the token here or just set the user state
          setCurrentUser({ token });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  // Register new user
  const register = async (userData) => {
    setAuthError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // If registration directly returns a token
      if (data.data && data.data.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
        setCurrentUser({ token: data.data.accessToken });
        return true;
      }
      
      return data;
    } catch (error) {
      setAuthError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setAuthError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (data.data && data.data.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
        setCurrentUser({ token: data.data.accessToken });
        return true;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      setAuthError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('/api/v1/users/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('token');
      setCurrentUser(null);
      setIsLoading(false);
      navigate('/');
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const response = await fetch('/api/v1/users/refresh-token', {
        method: 'POST',
        credentials: 'include', // Necessary for cookies
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }
      
      if (data.data && data.data.accessToken) {
        localStorage.setItem('token', data.data.accessToken);
        setCurrentUser({ token: data.data.accessToken });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      localStorage.removeItem('token');
      setCurrentUser(null);
      return false;
    }
  };

  // Authentication context value
  const value = {
    currentUser,
    isLoading,
    authError,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider; 