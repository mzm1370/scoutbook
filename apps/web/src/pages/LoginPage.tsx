import { Navigate, useNavigate } from 'react-router-dom';
import {
  LoginForm,
  type LoginFormValues,
} from '../components/login-form';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      navigate('/features', { replace: true });
    } catch {
      // Toast shown by HTTP interceptor
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10">
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
}
