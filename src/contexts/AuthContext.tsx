'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define user roles similar to backend
export type UserRole = 'STUDENT' | 'ADVISOR' | 'SECRETARY' | 'DEAN' | 'STUDENT_AFFAIRS';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  faculty?: string;
  studentId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'http://localhost:5000';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (token: string, userData: AuthUser) => {
    console.log('AuthContext login called with:', { token, userData });
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    console.log('Token saved to localStorage:', localStorage.getItem('authToken'));
    console.log('User saved to localStorage:', localStorage.getItem('currentUser'));
    setUser(userData);
    console.log('User state updated, isAuthenticated will be:', !!userData);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated,
      login, 
      logout 
    }}>
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