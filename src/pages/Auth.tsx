
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, User, LogIn } from "lucide-react";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        toast.success("Connexion réussie");
        navigate("/");
      } else {
        // Signup
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
            }
          }
        });

        if (error) {
          throw error;
        }

        toast.success("Inscription réussie! Veuillez vérifier votre email.");
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Cultiv</h1>
        <p className="text-gray-600">Gérez vos espaces de culture simplement</p>
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-green-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <LogIn className="h-6 w-6 text-green-600" />
            {isLogin ? "Se connecter" : "S'inscrire"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? "Connectez-vous pour gérer vos espaces de culture" 
              : "Créez un compte pour commencer à gérer vos cultures"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-1">
                  <User className="h-4 w-4" /> Nom d'utilisateur
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="votre_nom"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1">
                <Lock className="h-4 w-4" /> Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700" 
              disabled={loading}
            >
              {loading
                ? "Chargement..." 
                : isLogin 
                  ? "Se connecter" 
                  : "S'inscrire"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            variant="link" 
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-700"
          >
            {isLogin 
              ? "Vous n'avez pas de compte ? S'inscrire" 
              : "Déjà un compte ? Se connecter"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
