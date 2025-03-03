
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { User, UserCircle, Mail, Edit, Save, LogOut } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
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
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProfile();
  }, [navigate]);

  const handleUpdateProfile = async () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card className="shadow-lg border-green-100">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-green-700">Profil Utilisateur</CardTitle>
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
            <div className="bg-green-100 rounded-full p-8 text-green-700">
              <UserCircle size={80} />
            </div>
          </div>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-600" />
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
                <User className="h-4 w-4 text-green-600" />
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
                <User className="h-4 w-4 text-green-600" />
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
            <Badge variant="outline" className="px-3 py-1 border-green-200 bg-green-50 text-green-700">
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
