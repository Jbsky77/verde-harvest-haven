
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { toast } from 'sonner';

export default function Auth() {
  const { loading } = useAuth();
  const navigate = useNavigate();

  // Effectuer la redirection vers la page principale
  useEffect(() => {
    console.log("Auth page - Redirection effect triggered, loading:", loading);
    
    // Ajouter un délai court pour s'assurer que le contexte d'authentification est chargé
    const redirectTimer = setTimeout(() => {
      console.log("Redirecting to home page now");
      navigate('/', { replace: true });
      toast.info("Redirection effectuée");
    }, 1500);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background">
      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
      <span className="text-lg">Redirection en cours...</span>
    </div>
  );
}
