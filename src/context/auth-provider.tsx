'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/api';
import type { User } from '@prisma/client';

interface AuthContextType {
  user: (User & {
    postsCount: number;
    followersCount: number;
    followingCount: number;
    followingUsers: User[];
    bookmarkedPosts: Post[];
  }) | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userProfile = await getUserProfile('clx12v50p000008l4hy25c5s6');
      setUser(userProfile);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
