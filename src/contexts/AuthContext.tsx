import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginPayload, RegisterPayload, ChangePasswordPayload } from '@/types';
import api, { fetchCsrfToken } from '@/lib/api';
import { showLoading, dismissToast, updateToast } from '@/utils/toast';
import axios, { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<AuthResponse>;
  register: (data: RegisterPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<User>;
  changePassword: (data: ChangePasswordPayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await api.get('/user');
      setUser(response.data.user);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to refresh user profile.", error.message);
      } else {
        console.error("Failed to refresh user profile.", error);
      }
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await api.get('/user');
          setUser(response.data.user);
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            console.error("Failed to fetch user, token might be invalid.", error.message);
          } else {
            console.error("Failed to fetch user, token might be invalid.", error);
          }
          localStorage.removeItem('authToken');
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (data: LoginPayload): Promise<AuthResponse> => {
    await fetchCsrfToken();
    const response = await api.post('/login', data);
    const { access_token, user: rawUser } = response.data;
    localStorage.setItem('authToken', access_token);
    setUser({ ...rawUser });
    return response.data;
  };

  const register = async (data: RegisterPayload): Promise<AuthResponse> => {
    await fetchCsrfToken();
    const response = await api.post('/register', data);
    const { access_token, user: rawUser, needs_seller_payment } = response.data;
    // Always set token upon successful registration, as it's needed for payment initiation
    localStorage.setItem('authToken', access_token);
    setUser({ ...rawUser }); // Reflect the backend's actual account state
    return response.data;
  };

  const logout = async () => {
    const toastId = showLoading("Logging out...");
    try {
      await fetchCsrfToken();
      await api.post('/logout');
      updateToast(toastId, { type: 'success', message: "Logged out successfully." });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Logout failed, clearing session locally.", error.message);
        updateToast(toastId, { type: 'error', message: error.response?.data?.message || "Logout failed." });
      } else {
        console.error("Logout failed, clearing session locally.", error);
        updateToast(toastId, { type: 'error', message: "Logout failed." });
      }
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      // Redirect is handled in the Header component to have access to navigate
    }
  };

  const updateUserProfile = async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/user', data);
    const updatedUser = response.data.user;
    setUser(updatedUser);
    return updatedUser;
  };

  const changePassword = async (data: ChangePasswordPayload): Promise<void> => {
    try {
      await api.post('/user/password', data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Change password failed:", error.message);
      } else {
        console.error("Change password failed:", error);
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser, updateUserProfile, changePassword }}>
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
