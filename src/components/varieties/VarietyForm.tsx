
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { PlantVariety } from "@/types";
import { toast } from "sonner";
import { 
  addVariety, 
  getVarieties, 
  updateVariety, 
  deleteVariety 
} from "@/integrations/firebase/firestore";
import VarietyDialog from "./VarietyDialog";
import VarietyTable from "./VarietyTable";

export const VarietyForm = () => {
  const [varieties, setVarieties] = useState<PlantVariety[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariety, setEditingVariety] = useState<PlantVariety | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVarieties();
  }, []);

  const fetchVarieties = async () => {
    try {
      setIsLoading(true);
      const varietiesData = await getVarieties();
      setVarieties(varietiesData);
    } catch (error: any) {
      console.error("Error fetching varieties:", error);
      toast.error("Erreur lors du chargement des variétés");
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (variety?: PlantVariety) => {
    if (variety) {
      setEditingVariety(variety);
    } else {
      setEditingVariety(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (formData: Omit<PlantVariety, "id">) => {
    try {
      if (editingVariety) {
        // Update existing variety
        await updateVariety(editingVariety.id, formData);
        toast.success(`Variété "${formData.name}" mise à jour avec succès`);
      } else {
        // Create new variety
        await addVariety(formData);
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
        await deleteVariety(variety.id);
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
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Chargement des variétés...</div>
        ) : (
          <VarietyTable 
            varieties={varieties} 
            onEdit={openDialog} 
            onDelete={handleDelete} 
          />
        )}
      </CardContent>

      <VarietyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        currentVariety={editingVariety}
        isEditing={!!editingVariety}
      />
    </Card>
  );
};
