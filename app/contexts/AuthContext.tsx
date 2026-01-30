'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Avoid accessing localStorage during SSR
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch (err) {
      console.error('Error parsing stored user during init:', err);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    // Initialize from localStorage so UI (e.g., Header avatar) is immediately available
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }

    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to fetch the profile from the backend to sync
        console.log('Fetching profile from backend...');
        const userData = await authAPI.getProfile();
        console.log('Profile fetched successfully:', userData);
        if (userData && userData.id) {
          const user = {
            id: userData.id || userData._id,
            name: userData.name || 'User',
            email: userData.email || '',
            role: userData.role || 'CANDIDATE',
          };
          setUser(user);
          // Update localStorage with fresh data from backend
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.warn('Could not fetch user profile from backend:', error);
        // If we have a stored user, keep it to avoid UI flicker (avatar disappearing on refresh)
        if (storedUser) {
          console.warn('Keeping user from localStorage due to profile fetch error.');
        } else {
          // No stored user — clear state and localStorage
          setUser(null);
          localStorage.removeItem('user');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      console.log('Login response:', response);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      console.log('User set after login:', response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
