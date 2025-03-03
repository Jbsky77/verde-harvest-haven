
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

export default function Auth() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      console.log("User authenticated, redirecting to home page");
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLoginSuccess = () => {
    // The redirection is now handled by the useEffect
  };

  const handleSignupSuccess = () => {
    setActiveTab('login');
  };

  // Render null if user is already authenticated
  if (user) return null;

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
