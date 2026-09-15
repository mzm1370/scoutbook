import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from '@scoutbook/ui/components/sonner';
import { AuthProvider } from '@web/auth/AuthContext';
import { ProtectedRoute } from '@web/auth/ProtectedRoute';
import { DashboardLayout } from '@web/layouts/DashboardLayout';
import { DashboardPage } from '@web/pages/DashboardPage';
import { FeatureDetailPage } from '@web/pages/FeatureDetailPage';
import { FeaturesPage } from '@web/pages/FeaturesPage';
import { LoginPage } from '@web/pages/LoginPage';
import { NewFeaturePage } from '@web/pages/NewFeaturePage';
import { RegisterPage } from '@web/pages/RegisterPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/features/new" element={<NewFeaturePage />} />
              <Route path="/features/:id" element={<FeatureDetailPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}
