import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from '@scoutbook/ui/components/sonner';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { FeatureDetailPage } from './pages/FeatureDetailPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { LoginPage } from './pages/LoginPage';
import { NewFeaturePage } from './pages/NewFeaturePage';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/features" replace />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/features/new" element={<NewFeaturePage />} />
            <Route path="/features/:id" element={<FeatureDetailPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/features" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}
