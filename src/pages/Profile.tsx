
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { User, UserCircle, Mail, Edit, Save, LogOut, AlertCircle } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [isTokenRefreshed, setIsTokenRefreshed] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setAuthError(true);
          return;
        }
        
        // If no active session, redirect to auth
        if (!sessionData.session) {
          navigate("/auth");
          return;
        }
        
        fetchUserAndProfile();
      } catch (error) {
        console.error("Session check error:", error);
        setAuthError(true);
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate, isTokenRefreshed]);

  const fetchUserAndProfile = async () => {
    try {
      setLoading(true);
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error fetching user data:", userError);
        if (userError.message.includes("JWT")) {
          // Try to refresh the session if JWT error occurs
          const { error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Error refreshing session:", refreshError);
            setAuthError(true);
            return;
          }
          
          setIsTokenRefreshed(prev => !prev);
          return;
        }
        throw userError;
      }
      
      if (!user) {
        navigate("/auth");
        return;
      }
      
      setUser(user);
      
      // Get the user's profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }
      
      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username || "");
        setFullName(profileData.full_name || "");
      } else {
        // Handle case where profile doesn't exist yet
        setAuthError(true);
        toast.error("Profil non trouvé. Veuillez vous reconnecter.");
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast.error("Erreur lors du chargement du profil");
      setAuthError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !user.id) {
      toast.error("Session expirée. Veuillez vous reconnecter.");
      navigate("/auth");
      return;
    }
    
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          full_name: fullName
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      setProfile({
        ...profile,
        username,
        full_name: fullName
      });
      
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Déconnexion réussie");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
    }
  };

  const handleReconnect = () => {
    navigate("/auth");
  };

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-1.5 rounded-full bg-red-50">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-600">Erreur d'authentification</h2>
            </div>
            
            <p className="text-gray-600">Votre session a expiré ou n'est plus valide</p>
            
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 mb-6">Veuillez vous reconnecter pour accéder à votre profil</p>
              
              <Button 
                onClick={handleReconnect}
                className="w-full"
              >
                Se reconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user or profile is null after loading, show an error
  if (!user || !profile) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Card className="shadow-lg border-red-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" /> Erreur de chargement
            </CardTitle>
            <CardDescription>Impossible de charger les données du profil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-600">
              Il y a eu un problème lors du chargement de votre profil. Veuillez vous reconnecter.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <Button 
              onClick={handleLogout}
              className="w-full max-w-xs"
            >
              Se reconnecter
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card className="shadow-lg border-purple-100">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">Profil Utilisateur</CardTitle>
              <CardDescription>Gérez vos informations personnelles</CardDescription>
            </div>
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
            ) : (
              <Button 
                variant="success" 
                size="sm" 
                className="flex items-center gap-1" 
                onClick={handleUpdateProfile}
                disabled={updating}
              >
                <Save className="h-4 w-4" />
                {updating ? "Mise à jour..." : "Enregistrer"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 rounded-full p-8 text-primary">
              <UserCircle size={80} />
            </div>
          </div>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <Label htmlFor="email">Email</Label>
              </div>
              <Input 
                id="email" 
                value={user?.email || ""} 
                readOnly 
                disabled 
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <Label htmlFor="username">Nom d'utilisateur</Label>
              </div>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                readOnly={!isEditing} 
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <Label htmlFor="fullname">Nom complet</Label>
              </div>
              <Input 
                id="fullname" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                readOnly={!isEditing} 
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 border-purple-200 bg-purple-50 text-primary">
              Compte créé le {new Date(profile?.created_at).toLocaleDateString('fr-FR')}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button 
            variant="outline" 
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
