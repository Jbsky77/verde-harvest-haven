
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { toast } from 'sonner';

export default function Auth() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();

  // Effectuer la redirection vers la page principale
  useEffect(() => {
    console.log("Auth page - Redirection effect triggered, loading:", loading, "user:", !!user);
    
    // Si l'utilisateur est déjà connecté, rediriger immédiatement
    if (user) {
      console.log("User already authenticated, redirecting to home page now");
      navigate('/', { replace: true });
      return;
    }
    
    // Si le chargement est terminé et qu'il n'y a pas d'utilisateur, attendre un moment avant de rediriger
    if (!loading && !user) {
      console.log("Auth loading complete, no user found, redirecting to home after delay");
      const redirectTimer = setTimeout(() => {
        console.log("Redirecting to home page now");
        navigate('/', { replace: true });
        toast.info("Redirection effectuée");
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [loading, user, navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background">
      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
      <span className="text-lg">Redirection en cours...</span>
    </div>
  );
}
