import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the current user if logged in
    axios.get('/api/session')
      .then(response => {
        if (response.status === 200 && response.data.user) {
          setUser(response.data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/session', credentials);
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.delete('/api/session');
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (data) => {
    try {
      const response = await axios.post('/api/users', data);
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
