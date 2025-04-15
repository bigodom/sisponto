// src/Auth/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import api from '../services/api';

export interface User { login: string; name: string; role: string; }

export interface AuthContextProps {
  user: User | null;
  authenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const login = localStorage.getItem('login');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    if (login && name && role) {
      setUser({ login, name, role });
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (loginStr: string, password: string) => {
    const res = await api.post('/user', { login: loginStr, password });
    const u: User = { login: res.data.login, name: res.data.name, role: res.data.role };
    localStorage.setItem('login', u.login);
    localStorage.setItem('name', u.name);
    localStorage.setItem('role', u.role);
    setUser(u);
    setAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAuthenticated(false);
  };

  if (loading) return <div className="center-content"><h2>Carregando...</h2></div>;

  return (
    <AuthContext.Provider value={{ user, authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
