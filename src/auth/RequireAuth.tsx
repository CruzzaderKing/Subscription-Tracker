// src/auth/RequireAuth.tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from './AuthProvider';

type Props = { children: ReactNode };

export function RequireAuth({ children }: Props) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/auth/login" replace />;
}
