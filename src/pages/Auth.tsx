
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { toast } from 'sonner';

export default function Auth() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log("Auth page - User state:", user ? "Logged in" : "Not logged in", "Loading:", loading);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      console.log("User authenticated, redirecting to home page");
      // Adding a slight delay to ensure all auth context is properly updated
      const timeout = setTimeout(() => {
        navigate('/', { replace: true });
      }, 200);
      
      return () => clearTimeout(timeout);
    }
  }, [user, navigate]);

  const handleLoginSuccess = () => {
    console.log("Login success handler called");
    toast.success('Connexion réussie!');
    // The redirection is now handled by the useEffect
  };

  const handleSignupSuccess = () => {
    console.log("Signup success handler called");
    toast.success('Compte créé avec succès! Veuillez vous connecter.');
    setActiveTab('login');
  };

  // Show loading state while auth state is being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );
  }
  
  // If user is already authenticated, don't render the auth form
  // This avoids flickering before the redirect happens
  if (user) {
    console.log("User exists, rendering null");
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">Redirection en cours...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Gestion de Cultivation CBD
          </CardTitle>
          <CardDescription className="text-center">
            Connectez-vous ou créez un compte pour gérer vos espaces de culture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSuccess={handleLoginSuccess} />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm onSuccess={handleSignupSuccess} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {activeTab === 'login' 
              ? "Pas encore de compte? " 
              : "Déjà un compte? "}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
            >
              {activeTab === 'login' ? "S'inscrire" : "Se connecter"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
