
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute - Auth check, user:", !!user, "loading:", loading);
    
    // Si le chargement est terminé et qu'il n'y a pas d'utilisateur, rediriger vers /auth
    if (!loading && !user) {
      console.log("No user found, redirecting to auth page");
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  // Afficher un indicateur de chargement pendant la vérification d'authentification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Rendre le contenu uniquement si l'utilisateur est authentifié
  return user ? <>{children}</> : null;
};
