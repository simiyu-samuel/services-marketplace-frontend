import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '@/types';
import api, { fetchCsrfToken } from '@/lib/api';
import { showLoading, dismissToast } from '@/utils/toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<User>;
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
          const response = await api.get('/user');
          setUser(response.data.user);
        } catch (error) {
          console.error("Failed to fetch user, token might be invalid.", error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (data: any): Promise<AuthResponse> => {
    await fetchCsrfToken();
    const response = await api.post('/login', data);
    const { access_token, user } = response.data;
    localStorage.setItem('authToken', access_token);
    setUser(user);
    return response.data;
  };

  const register = async (data: any): Promise<AuthResponse> => {
    await fetchCsrfToken();
    const response = await api.post('/register', data);
    const { access_token, user } = response.data;
    localStorage.setItem('authToken', access_token);
    setUser(user);
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
    }
  };

  const updateUserProfile = async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/user', data);
    const updatedUser = response.data.user;
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserProfile }}>
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