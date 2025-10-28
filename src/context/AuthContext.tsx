"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  // This function would be in a real app to update user data after edits
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// For this frontend-only demo, we'll just pick the first user as the logged-in user.
const MOCK_LOGGED_IN_USER_ID = '1';
// You can switch this to MOCK_ADMIN_USER_ID to test admin features:
const MOCK_ADMIN_USER_ID = mockUsers.find(u => u.role === 'ADMIN')?.id || '2';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userId: string) => {
    const userToLogin = mockUsers.find(u => u.id === userId);
    setUser(userToLogin || null);
  };
  
  // This is a mock function to simulate refetching user data
  const refetchUser = () => {
    if (user) {
      const updatedUser = mockUsers.find(u => u.id === user.id);
      setUser(updatedUser || null);
    }
  };

  useEffect(() => {
    // Auto-login the default user for demo purposes.
    // Change MOCK_LOGGED_IN_USER_ID to MOCK_ADMIN_USER_ID to log in as admin.
    login(MOCK_LOGGED_IN_USER_ID);
  }, []);

  const logout = () => {
    setUser(null);
    // In a real app, you would redirect to a login page
    console.log("User logged out.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
