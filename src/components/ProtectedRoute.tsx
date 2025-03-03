
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if loading is complete and there's no user
    if (!loading && !user) {
      console.log("ProtectedRoute: No authenticated user found, redirecting to /auth");
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading spinner while authentication status is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If authenticated, render children
  return user ? <>{children}</> : null;
};
