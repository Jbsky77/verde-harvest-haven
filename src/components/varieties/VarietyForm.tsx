
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PlantVariety } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const VarietyForm = () => {
  const [varieties, setVarieties] = useState<PlantVariety[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariety, setEditingVariety] = useState<PlantVariety | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#9b87f5",
    germinationTime: "",
    growthTime: "",
    floweringTime: "",
    dryWeight: ""
  });

  useEffect(() => {
    fetchVarieties();
  }, []);

  const fetchVarieties = async () => {
    try {
      const { data, error } = await supabase
        .from("plant_varieties")
        .select("*");
      
      if (error) throw error;
      
      if (data) {
        const transformedVarieties: PlantVariety[] = data.map(item => ({
          id: item.id,
          name: item.name,
          color: item.color,
          germinationTime: item.germination_time,
          growthTime: item.growth_time,
          floweringTime: item.flowering_time,
          dryWeight: item.dry_weight
        }));
        setVarieties(transformedVarieties);
      }
    } catch (error: any) {
      console.error("Error fetching varieties:", error);
      toast.error("Erreur lors du chargement des variétés");
    }
  };

  const openDialog = (variety?: PlantVariety) => {
    if (variety) {
      setEditingVariety(variety);
      setFormData({
        name: variety.name,
        color: variety.color,
        germinationTime: variety.germinationTime?.toString() || "",
        growthTime: variety.growthTime?.toString() || "",
        floweringTime: variety.floweringTime?.toString() || "",
        dryWeight: variety.dryWeight?.toString() || ""
      });
    } else {
      setEditingVariety(null);
      setFormData({
        name: "",
        color: "#9b87f5",
        germinationTime: "",
        growthTime: "",
        floweringTime: "",
        dryWeight: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Le nom de la variété est requis");
      return;
    }

    try {
      if (editingVariety) {
        // Update existing variety
        const { error } = await supabase
          .from("plant_varieties")
          .update({
            name: formData.name,
            color: formData.color,
            germination_time: formData.germinationTime ? parseInt(formData.germinationTime) : null,
            growth_time: formData.growthTime ? parseInt(formData.growthTime) : null,
            flowering_time: formData.floweringTime ? parseInt(formData.floweringTime) : null,
            dry_weight: formData.dryWeight ? parseFloat(formData.dryWeight) : null
          })
          .eq("id", editingVariety.id);

        if (error) throw error;
        toast.success(`Variété "${formData.name}" mise à jour avec succès`);
      } else {
        // Create new variety
        const { error } = await supabase
          .from("plant_varieties")
          .insert({
            name: formData.name,
            color: formData.color,
            germination_time: formData.germinationTime ? parseInt(formData.germinationTime) : null,
            growth_time: formData.growthTime ? parseInt(formData.growthTime) : null,
            flowering_time: formData.floweringTime ? parseInt(formData.floweringTime) : null,
            dry_weight: formData.dryWeight ? parseFloat(formData.dryWeight) : null
          });

        if (error) throw error;
        toast.success(`Nouvelle variété "${formData.name}" créée avec succès`);
      }

      setIsDialogOpen(false);
      fetchVarieties();
    } catch (error: any) {
      console.error("Error saving variety:", error);
      toast.error("Erreur lors de l'enregistrement de la variété");
    }
  };

  const handleDelete = async (variety: PlantVariety) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la variété "${variety.name}" ?`)) {
      try {
        const { error } = await supabase
          .from("plant_varieties")
          .delete()
          .eq("id", variety.id);

        if (error) throw error;
        toast.success(`Variété "${variety.name}" supprimée avec succès`);
        fetchVarieties();
      } catch (error: any) {
        console.error("Error deleting variety:", error);
        toast.error("Erreur lors de la suppression de la variété");
      }
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl">Gestion des Variétés</CardTitle>
        <Button onClick={() => openDialog()} className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle variété
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Couleur</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead className="text-right">Germination (j)</TableHead>
              <TableHead className="text-right">Croissance (j)</TableHead>
              <TableHead className="text-right">Floraison (j)</TableHead>
              <TableHead className="text-right">Poids sec (g)</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {varieties.map((variety) => (
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
                <TableCell className="text-right">{variety.dryWeight || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openDialog(variety)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(variety)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom de la variété"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full border border-gray-200" 
                  style={{ backgroundColor: formData.color }} 
                />
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
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
                value={formData.germinationTime}
                onChange={(e) => setFormData(prev => ({ ...prev, germinationTime: e.target.value }))}
                placeholder="Ex: 5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="growthTime">Temps de croissance (jours)</Label>
              <Input
                id="growthTime"
                type="number"
                min="1"
                value={formData.growthTime}
                onChange={(e) => setFormData(prev => ({ ...prev, growthTime: e.target.value }))}
                placeholder="Ex: 30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floweringTime">Temps de floraison (jours)</Label>
              <Input
                id="floweringTime"
                type="number"
                min="1"
                value={formData.floweringTime}
                onChange={(e) => setFormData(prev => ({ ...prev, floweringTime: e.target.value }))}
                placeholder="Ex: 60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dryWeight">Poids sec par plant (grammes)</Label>
              <Input
                id="dryWeight"
                type="number"
                step="0.1"
                min="0"
                value={formData.dryWeight}
                onChange={(e) => setFormData(prev => ({ ...prev, dryWeight: e.target.value }))}
                placeholder="Ex: 120.5"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingVariety ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
