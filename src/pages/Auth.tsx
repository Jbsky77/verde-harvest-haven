
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { toast } from 'sonner';
import { LoginForm, SignupForm } from '@/components/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Auth() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  // Effectuer la redirection vers la page principale si l'utilisateur est déjà connecté
  useEffect(() => {
    console.log("Auth page - Auth check, loading:", loading, "user:", !!user);
    
    // Si l'utilisateur est déjà connecté, rediriger immédiatement
    if (!loading && user) {
      console.log("User already authenticated, redirecting to home page now");
      navigate('/', { replace: true });
    }
  }, [loading, user, navigate]);

  // Si encore en chargement, afficher un spinner
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <span className="text-lg">Chargement...</span>
      </div>
    );
  }

  // Si l'utilisateur n'est pas encore connecté, afficher le formulaire d'authentification
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Bienvenue</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
