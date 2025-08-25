import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginPayload, RegisterPayload, ChangePasswordPayload } from '@/types';
import api, { fetchCsrfToken } from '@/lib/api';
import { showLoading, dismissToast } from '@/utils/toast';
import axios, { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<AuthResponse>;
  register: (data: RegisterPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<User>;
  changePassword: (data: ChangePasswordPayload) => Promise<void>;
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
    // Frontend workaround: If a seller has a package but email is not verified, assume verified
    const user = { ...rawUser };
    if (user.user_type === 'seller' && user.seller_package && !user.email_verified_at) {
      user.email_verified_at = new Date().toISOString();
      console.log("Frontend: Bypassing email verification for paid seller.");
    }
    setUser(user);
    return response.data;
  };

  const register = async (data: RegisterPayload): Promise<AuthResponse> => {
    await fetchCsrfToken();
    const response = await api.post('/register', data);
    const { access_token, user: rawUser, needs_seller_payment } = response.data;
    // Always set token upon successful registration, as it's needed for payment initiation
    localStorage.setItem('authToken', access_token);
    // Frontend workaround: If a seller has a package but email is not verified, assume verified
    const user = { ...rawUser };
    if (user.user_type === 'seller' && user.seller_package && !user.email_verified_at) {
      user.email_verified_at = new Date().toISOString();
      console.log("Frontend: Bypassing email verification for paid seller during registration.");
    }
    setUser(user); // Set user to reflect initial state (customer with pending package)
    return response.data;
  };

  const logout = async () => {
    const toastId = showLoading("Logging out...");
    try {
      await fetchCsrfToken();
      await api.post('/logout');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Logout failed, clearing session locally.", error.message);
      } else {
        console.error("Logout failed, clearing session locally.", error);
      }
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      dismissToast(toastId.toString()); // Ensure toastId is string
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
      await api.put('/user/password', data);
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
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserProfile, changePassword }}>
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
