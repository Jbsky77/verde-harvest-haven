
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";
import { toast } from "sonner";

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .single();
          
          if (data) {
            setUsername(data.username);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
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

  return (
    <div className="mt-auto p-4 border-t border-muted">
      <Link to="/profile">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start mb-2 text-green-700 hover:text-green-800 hover:bg-green-50"
        >
          <UserCircle className="mr-2 h-4 w-4" />
          {username || "Mon profil"}
        </Button>
      </Link>
      <Button 
        variant="outline"
        size="sm"
        className="w-full justify-start" 
        onClick={handleLogout}
        disabled={loading}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Déconnexion
      </Button>
    </div>
  );
};

export default UserProfile;
