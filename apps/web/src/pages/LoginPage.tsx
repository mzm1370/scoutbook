import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  LoginForm,
  type LoginFormValues,
} from '../components/login-form';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../lib/api';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      await login(values);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(
        err instanceof ApiError ? err.message : 'Login failed. Try again.',
      );
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10">
      <LoginForm onSubmit={onSubmit} serverError={serverError} />
    </div>
  );
}
