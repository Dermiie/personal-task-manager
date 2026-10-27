import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../api';

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<'loading' | 'authed' | 'guest'>(
    'loading',
  );

  useEffect(() => {
    let active = true;

    getUser()
      .then((user) => {
        if (active) setStatus(user ? 'authed' : 'guest');
      })
      .catch(() => {
        if (active) setStatus('guest'); // 401 or network error
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'guest') return <Navigate to="/login" replace />;

  return <>{children}</>;
}
