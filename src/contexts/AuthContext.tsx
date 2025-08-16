import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api, { fetchCsrfToken } from '@/lib/api';
import { User, AuthResponse } from '@/types';
import { showLoading, dismissToast, showError } from '@/utils/toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          await fetchCsrfToken(); // Ensure CSRF token is fresh
          const response = await api.get('/user');
          setUser(response.data.user);
        } catch (error) {
          console.error("Failed to fetch user", error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (data: any) => {
    await fetchCsrfToken();
    const response = await api.post<AuthResponse>('/login', data);
    localStorage.setItem('authToken', response.data.access_token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (data: any) => {
    await fetchCsrfToken();
    const response = await api.post<AuthResponse>('/register', data);
    localStorage.setItem('authToken', response.data.access_token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    const toastId = showLoading("Logging out...");
    try {
      await api.post('/logout');
    } catch (error) {
        console.error("Logout failed, clearing session locally.", error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      dismissToast(toastId);
      // Redirect is handled in the component
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};