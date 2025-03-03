
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { User, UserCircle, Mail, Edit, Save, LogOut, AlertCircle, PlusCircle, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlantVariety } from "@/types";

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
  
  // État pour les variétés de plantes
  const [varieties, setVarieties] = useState<PlantVariety[]>([]);
  const [isVarietyDialogOpen, setIsVarietyDialogOpen] = useState(false);
  const [newVarietyName, setNewVarietyName] = useState("");
  const [newVarietyColor, setNewVarietyColor] = useState("#9b87f5");
  const [newVarietyGerminationTime, setNewVarietyGerminationTime] = useState<number | undefined>(undefined);
  const [newVarietyGrowthTime, setNewVarietyGrowthTime] = useState<number | undefined>(undefined);
  const [newVarietyFloweringTime, setNewVarietyFloweringTime] = useState<number | undefined>(undefined);
  const [editingVariety, setEditingVariety] = useState<PlantVariety | null>(null);

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
        fetchVarieties();
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

  const fetchVarieties = async () => {
    try {
      const { data, error } = await supabase
        .from("plant_varieties")
        .select("*");
      
      if (error) throw error;
      
      if (data) {
        setVarieties(data);
      }
    } catch (error: any) {
      console.error("Error fetching varieties:", error);
      toast.error("Erreur lors du chargement des variétés");
    }
  };

  const openVarietyDialog = (variety?: PlantVariety) => {
    if (variety) {
      setEditingVariety(variety);
      setNewVarietyName(variety.name);
      setNewVarietyColor(variety.color);
      setNewVarietyGerminationTime(variety.germinationTime);
      setNewVarietyGrowthTime(variety.growthTime);
      setNewVarietyFloweringTime(variety.floweringTime);
    } else {
      setEditingVariety(null);
      setNewVarietyName("");
      setNewVarietyColor("#9b87f5");
      setNewVarietyGerminationTime(undefined);
      setNewVarietyGrowthTime(undefined);
      setNewVarietyFloweringTime(undefined);
    }
    setIsVarietyDialogOpen(true);
  };

  const handleSaveVariety = async () => {
    if (!newVarietyName.trim()) {
      toast.error("Veuillez entrer un nom pour la variété");
      return;
    }

    try {
      setUpdating(true);
      
      if (editingVariety) {
        // Mise à jour d'une variété existante
        const { error } = await supabase
          .from("plant_varieties")
          .update({
            name: newVarietyName,
            color: newVarietyColor,
            germination_time: newVarietyGerminationTime,
            growth_time: newVarietyGrowthTime,
            flowering_time: newVarietyFloweringTime
          })
          .eq("id", editingVariety.id);
          
        if (error) throw error;
        
        toast.success(`Variété "${newVarietyName}" mise à jour avec succès`);
      } else {
        // Création d'une nouvelle variété
        const { error } = await supabase
          .from("plant_varieties")
          .insert({
            name: newVarietyName,
            color: newVarietyColor,
            germination_time: newVarietyGerminationTime,
            growth_time: newVarietyGrowthTime,
            flowering_time: newVarietyFloweringTime
          });
          
        if (error) throw error;
        
        toast.success(`Nouvelle variété "${newVarietyName}" créée avec succès`);
      }
      
      // Rafraîchir la liste des variétés
      fetchVarieties();
      setIsVarietyDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving variety:", error);
      toast.error(error.message || "Erreur lors de l'enregistrement de la variété");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteVariety = async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la variété "${name}" ?`)) {
      try {
        const { error } = await supabase
          .from("plant_varieties")
          .delete()
          .eq("id", id);
          
        if (error) throw error;
        
        toast.success(`Variété "${name}" supprimée avec succès`);
        fetchVarieties();
      } catch (error: any) {
        console.error("Error deleting variety:", error);
        toast.error("Erreur lors de la suppression de la variété. Elle est peut-être utilisée par des plantes existantes.");
      }
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
        <Card className="shadow-lg border-purple-100">
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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="shadow-lg border-purple-100">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-2xl font-bold text-primary">Profil Utilisateur</CardTitle>
          <CardDescription>Gérez votre compte et vos variétés de plants</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-2 m-4">
            <TabsTrigger value="profile">Informations Personnelles</TabsTrigger>
            <TabsTrigger value="varieties">Mes Variétés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="p-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 rounded-full p-6 text-primary">
                    <UserCircle size={60} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{fullName || username}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
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
              
              <div className="grid gap-4 pt-4">
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
              
              <div className="flex items-center gap-2 pt-4">
                <Badge variant="outline" className="px-3 py-1 border-purple-200 bg-purple-50 text-primary">
                  Compte créé le {new Date(profile?.created_at).toLocaleDateString('fr-FR')}
                </Badge>
              </div>
              
              <CardFooter className="flex justify-end pt-6 px-0">
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </CardFooter>
            </div>
          </TabsContent>
          
          <TabsContent value="varieties" className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Mes variétés de plants</h2>
                <Button onClick={() => openVarietyDialog()} className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nouvelle variété
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Couleur</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead className="text-right">Germination (jours)</TableHead>
                    <TableHead className="text-right">Croissance (jours)</TableHead>
                    <TableHead className="text-right">Floraison (jours)</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {varieties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        Vous n'avez pas encore créé de variétés. Commencez par en ajouter une.
                      </TableCell>
                    </TableRow>
                  ) : (
                    varieties.map((variety) => (
                      <TableRow key={variety.id}>
                        <TableCell>
                          <div 
                            className="w-6 h-6 rounded-full" 
                            style={{ backgroundColor: variety.color }} 
                          />
                        </TableCell>
                        <TableCell>{variety.name}</TableCell>
                        <TableCell className="text-right">{variety.germinationTime || "-"}</TableCell>
                        <TableCell className="text-right">{variety.growthTime || "-"}</TableCell>
                        <TableCell className="text-right">{variety.floweringTime || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openVarietyDialog(variety)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteVariety(variety.id, variety.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Dialog pour l'ajout/édition de variété */}
      <Dialog open={isVarietyDialogOpen} onOpenChange={setIsVarietyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVariety ? `Modifier ${editingVariety.name}` : "Nouvelle variété"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={newVarietyName}
                onChange={(e) => setNewVarietyName(e.target.value)}
                placeholder="Nom de la variété"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full border border-gray-200" 
                  style={{ backgroundColor: newVarietyColor }} 
                />
                <Input
                  id="color"
                  type="color"
                  value={newVarietyColor}
                  onChange={(e) => setNewVarietyColor(e.target.value)}
                  className="w-20 h-10 p-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="germinationTime">Temps de germination (jours)</Label>
              <Input
                id="germinationTime"
                type="number"
                min="1"
                value={newVarietyGerminationTime || ""}
                onChange={(e) => setNewVarietyGerminationTime(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="growthTime">Temps de croissance (jours)</Label>
              <Input
                id="growthTime"
                type="number"
                min="1"
                value={newVarietyGrowthTime || ""}
                onChange={(e) => setNewVarietyGrowthTime(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="floweringTime">Temps de floraison (jours)</Label>
              <Input
                id="floweringTime"
                type="number"
                min="1"
                value={newVarietyFloweringTime || ""}
                onChange={(e) => setNewVarietyFloweringTime(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 60"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsVarietyDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSaveVariety}
              disabled={updating}
            >
              {updating ? "Enregistrement..." : (editingVariety ? "Mettre à jour" : "Créer")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
