
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export default function Auth() {
  const { loading } = useAuth();
  const navigate = useNavigate();

  // Always redirect to the main page
  useEffect(() => {
    // Only navigate if not currently loading
    if (!loading) {
      navigate('/', { replace: true });
    }
  }, [loading, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <span className="ml-3">Redirection en cours...</span>
    </div>
  );
}
