import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isPending, isError } = useCurrentUser();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
