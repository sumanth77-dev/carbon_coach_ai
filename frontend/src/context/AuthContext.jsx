import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Sumanth',
    email: 'sumanth@carboncoach.io',
    accountType: 'individual',
    plan: 'Individual Plan',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('carbon_coach_token');
    if (token) {
      // In production, validate token via /api/v1/auth/me
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('carbon_coach_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('carbon_coach_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
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
