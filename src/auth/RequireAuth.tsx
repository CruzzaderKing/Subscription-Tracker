// src/auth/RequireAuth.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export function RequireAuth({ children }: Props) {
  const { user, loading } = useAuth();
  if (loading) return null; // тут можешь вернуть спиннер
  return user ? <>{children}</> : <Navigate to="/auth/register" replace />;
}
