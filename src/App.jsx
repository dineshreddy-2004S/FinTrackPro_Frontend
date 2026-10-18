import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Dynamic Lazy Imports for optimal initial load speed
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

const PageLoader = () => (
  <div className="min-h-screen bg-[#060811] flex flex-col items-center justify-center space-y-3">
    <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-mono text-zinc-400 tracking-wider">FinTrack Pro Engine Loading...</span>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth?mode=login" replace />;

  return children;
};

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}