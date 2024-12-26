import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/LoadingScreen';

// Only these routes require authentication
const PROTECTED_ROUTES = [
  '/create',
  '/profile/setup',
  '/upgrade'
];

// These routes should redirect to profile setup if no profile exists
const PROFILE_REQUIRED_ROUTES = [
  '/create',
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
    if (user && !profile && !location.pathname.startsWith('/profile/setup')) {
      return <Navigate to="/profile/setup" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
}