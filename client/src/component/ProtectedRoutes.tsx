import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
