import { createContext, createElement, useContext } from 'react';
import type { ReactNode } from 'react';

import type { IUser } from '../types';
import { useCurrentUser } from '../hooks/useAuth';

type AuthContextType = {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending, isError } = useCurrentUser();

  const query = useCurrentUser();
  console.log('currentUser', query.status, query.fetchStatus, query.error);

  console.log(
    'currentUser',
    query.status,
    query.fetchStatus,
    'failures:',
    query.failureCount,
    query.failureReason,
  );

  const value: AuthContextType = {
    user: data ?? null,
    isLoading: isPending,
    isAuthenticated: !isPending && !isError && !!data,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
