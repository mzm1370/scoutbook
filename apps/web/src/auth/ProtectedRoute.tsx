import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="auth-shell">
        <p className="muted">Restoring session…</p>
      </main>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
