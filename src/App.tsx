import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { BookingsPage } from './pages/BookingsPage';
import { NursesPage } from './pages/NursesPage';
import { FallbackPage } from './pages/FallbackPage';
import { SettingsPage } from './pages/SettingsPage';
import { dataAdapter } from './data';

// Protected Route Component
const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isDemoActive, setIsDemoActive] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8F6] flex items-center justify-center text-xs text-slate-500 font-medium">
        Loading desk session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleToggleDemo = () => {
    if (isDemoActive) {
      dataAdapter.stopDemoReplay();
      setIsDemoActive(false);
    } else {
      dataAdapter.startDemoReplay('standard');
      setIsDemoActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] flex flex-col">
      <Header isDemoActive={isDemoActive} onToggleDemo={handleToggleDemo} />
      <Navigation />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Operator Desk Protected Routes */}
            <Route path="/app" element={<ProtectedLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="nurses" element={<NursesPage />} />
              <Route path="fallback" element={<FallbackPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
