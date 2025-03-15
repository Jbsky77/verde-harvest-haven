
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/integrations/firebase/config";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, User, LogIn, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/");
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Connexion réussie");
        navigate("/");
      } else {
        // Signup
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Set display name if username is provided
        if (username && userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: username
          });
        }
        
        toast.success("Inscription réussie!");
        navigate("/");
      }
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = "Une erreur est survenue";
      
      // Translate common Firebase auth errors
      switch(errorCode) {
        case 'auth/invalid-email':
          errorMessage = "L'adresse email est invalide.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Ce compte utilisateur a été désactivé.";
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = "Email ou mot de passe incorrect.";
          break;
        case 'auth/email-already-in-use':
          errorMessage = "Cette adresse email est déjà utilisée par un autre compte.";
          break;
        case 'auth/weak-password':
          errorMessage = "Le mot de passe est trop faible. Utilisez au moins 6 caractères.";
          break;
        default:
          errorMessage = error.message || "Une erreur est survenue";
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100 p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Cultiv</h1>
        <p className="text-gray-600">Gérez vos espaces de culture simplement</p>
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-purple-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <LogIn className="h-6 w-6 text-primary" />
            {isLogin ? "Se connecter" : "S'inscrire"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? "Connectez-vous pour gérer vos espaces de culture" 
              : "Créez un compte pour commencer à gérer vos cultures"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          {!isLogin && (
            <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">Information</AlertTitle>
              <AlertDescription className="text-amber-600">
                Les inscriptions par email peuvent être désactivées par l'administrateur. 
                Si vous ne pouvez pas vous inscrire, veuillez contacter l'administrateur.
              </AlertDescription>
            </Alert>
          )}
          
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
              className="w-full bg-primary hover:bg-primary/90" 
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
            onClick={() => {
              setIsLogin(!isLogin);
              setAuthError(null);
            }}
            className="text-primary"
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
