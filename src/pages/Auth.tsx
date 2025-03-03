
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { LoginForm, SignupForm } from '@/components/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Auth() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to home page
  useEffect(() => {
    if (!loading && user) {
      console.log("Auth page: User already authenticated, redirecting to home");
      navigate('/', { replace: true });
    }
  }, [loading, user, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-background">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <span className="text-lg">Chargement...</span>
      </div>
    );
  }

  // Don't render the login form if user is authenticated
  if (user) {
    return null;
  }

  // Render login/signup form if user is not authenticated
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Bienvenue</h1>
        
        <Tabs defaultValue="login" className="w-full">
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
