import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/LoadingScreen';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/create',
  '/profile/setup',
  '/upgrade'
];

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  // Only check authentication for protected routes
  if (PROTECTED_ROUTES.some(route => location.pathname.startsWith(route))) {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user exists but profile doesn't, redirect to profile setup
    if (user && !profile && location.pathname !== '/profile/setup') {
      return <Navigate to="/profile/setup" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
}