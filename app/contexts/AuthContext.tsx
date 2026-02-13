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
  logout: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    // Initialize from localStorage so UI (e.g., Header avatar) is immediately available
    const storedUserString = localStorage.getItem('user');
    let storedUser = null;
    if (storedUserString) {
      try {
        storedUser = JSON.parse(storedUserString);
        setUser(storedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }

    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setUser(null);
        localStorage.removeItem('user');
        setIsLoading(false);
        return;
      }

      try {
        // Try to fetch the profile from the backend to sync
        console.log('Fetching profile from backend...');
        const userData = await authAPI.getProfile();
        console.log('Profile fetched successfully:', userData);
        if (userData && (userData.id || userData._id)) {
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
          // If profile fetch fails or returned no user, clear session
          setUser(null);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.warn('Could not fetch user profile from backend:', error);
        // If it's a 401 Unauthorized, we should clear the user
        if (error instanceof Error && error.message.includes('401')) {
          setUser(null);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
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
      const user = {
        id: response.user.id,
        name: response.user.name || 'User',
        email: response.user.email || '',
        role: response.user.role || 'CANDIDATE',
      };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      console.log('User set after login:', user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Optional: Call backend logout
      await authAPI.logout().catch(err => console.error('Backend logout failed:', err));
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
    }
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
