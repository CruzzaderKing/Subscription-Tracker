// src/App.tsx
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainContent from "./pages/main/MainContent";
import RegisterPage from "./pages/auth/Register";
import { RequireAuth } from "./auth/RequireAuth";
import { useAuth } from "./auth/AuthProvider";

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;              // тут можно показать спиннер
  return user ? <Navigate to="/" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainContent />
            </RequireAuth>
          }
        />
        <Route
          path="/auth/register"
          element={
            <PublicOnly>
              <RegisterPage />
            </PublicOnly>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
