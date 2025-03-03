
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

  // Si la session est encore en cours de chargement, afficher un indicateur
  if (loading) {
    console.log("ProtectedRoute - Still loading, showing spinner");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, ne rien afficher (la redirection sera gérée par l'effet)
  if (!user) {
    console.log("ProtectedRoute - No user, returning null (redirect effect will handle)");
    return null;
  }

  // Rendre le contenu uniquement si l'utilisateur est authentifié
  console.log("ProtectedRoute - User authenticated, rendering content");
  return <>{children}</>;
};
