import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import LoadingScreen from './Loading';

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <LoadingScreen
        message="Checking your session"
        description="Hang tight while we verify your account."
      />
    );
  }

  if (!user || !isAuthenticated) {
    // Remember where the user was headed so login can send them back
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
