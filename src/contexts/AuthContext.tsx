import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '@/types';
import { showLoading, dismissToast } from '@/utils/toast';

// --- Mock Data ---
const mockCustomer: User = {
  id: 201,
  name: "Alice Johnson",
  email: "customer@test.com",
  phone_number: "254711111111",
  user_type: 'customer',
  is_active: true,
  profile_image_url: "/placeholder.svg",
};

const mockSeller: User = {
  id: 101,
  name: "Glamour Nails",
  email: "seller@test.com",
  phone_number: "254712345678",
  user_type: 'seller',
  is_active: true,
  profile_image_url: "/placeholder.svg",
  seller_package: 'premium',
};
// --- End Mock Data ---

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
    // Simulate checking for a logged-in user on app load
    const initializeAuth = () => {
      const userType = localStorage.getItem('authUserType');
      if (userType === 'customer') {
        setUser(mockCustomer);
      } else if (userType === 'seller') {
        setUser(mockSeller);
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (data: { email: string }): Promise<AuthResponse> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay

    let loggedInUser: User | null = null;
    if (data.email === mockCustomer.email) {
      loggedInUser = mockCustomer;
      localStorage.setItem('authUserType', 'customer');
    } else if (data.email === mockSeller.email) {
      loggedInUser = mockSeller;
      localStorage.setItem('authUserType', 'seller');
    }

    setIsLoading(false);
    if (loggedInUser) {
      setUser(loggedInUser);
      return {
        message: "Login successful",
        user: loggedInUser,
        access_token: "mock_auth_token",
        token_type: "Bearer",
      };
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (data: any): Promise<AuthResponse> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 500));
    
    const newUser: User = {
      id: Date.now(), // Use timestamp for a unique ID
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
      user_type: data.user_type,
      is_active: true,
    };
    
    setUser(newUser);
    localStorage.setItem('authUserType', data.user_type);
    setIsLoading(false);
    
    return {
      message: "Registration successful",
      user: newUser,
      access_token: "mock_auth_token",
      token_type: "Bearer",
    };
  };

  const logout = async () => {
    const toastId = showLoading("Logging out...");
    await new Promise(res => setTimeout(res, 500));
    localStorage.removeItem('authUserType');
    setUser(null);
    dismissToast(toastId);
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