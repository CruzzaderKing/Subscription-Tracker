// src/App.tsx
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { RequireAuth } from './auth/RequireAuth';
import RegisterPage from './pages/auth/Register';
import MainContent from './pages/main/MainContent';
import SubscriptionEditPage from './pages/subscriptions/SubscriptionEditPage'; // /subs/:id
import SubscriptionFormPage from './pages/subscriptions/SubscriptionFormPage'; // /subs/new

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
          path="/subs/new"
          element={
            <RequireAuth>
              <SubscriptionFormPage />
            </RequireAuth>
          }
        />
        <Route
          path="/subs/:id"
          element={
            <RequireAuth>
              <SubscriptionEditPage />
            </RequireAuth>
          }
        />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
