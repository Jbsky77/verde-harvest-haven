
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCultivation } from "@/context/CultivationContext";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { PlantVariety } from "@/types";
import { Badge } from "@/components/ui/badge";
import VarietyTable from "./VarietyTable";
import VarietyFormDialog from "./VarietyFormDialog";
import { addVariety, updateVariety, deleteVariety, getVarieties } from "@/integrations/firebase/firestore";

const VarietyList = () => {
  const { currentSession } = useCultivation();
  const [varieties, setVarieties] = useState<PlantVariety[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariety, setEditingVariety] = useState<PlantVariety | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch varieties on component mount
  useEffect(() => {
    fetchVarieties();
  }, []);

  const fetchVarieties = async () => {
    try {
      setIsLoading(true);
      const fetchedVarieties = await getVarieties();
      setVarieties(fetchedVarieties);
    } catch (error) {
      console.error("Error fetching varieties:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les variétés",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingVariety(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (variety: PlantVariety) => {
    setEditingVariety(variety);
    setIsDialogOpen(true);
  };

  const handleSaveVariety = async (varietyData: Omit<PlantVariety, "id">) => {
    try {
      if (editingVariety) {
        // Update existing variety
        await updateVariety(editingVariety.id, varietyData);
        toast({
          title: "Variété mise à jour",
          description: `La variété "${varietyData.name}" a été mise à jour`,
          variant: "default",
        });
      } else {
        // Create new variety
        await addVariety(varietyData);
        toast({
          title: "Variété créée",
          description: `La nouvelle variété "${varietyData.name}" a été créée`,
          variant: "default",
        });
      }
      
      fetchVarieties();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving variety:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement de la variété",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVariety = async (variety: PlantVariety) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la variété "${variety.name}" ?`)) {
      try {
        await deleteVariety(variety.id);
        
        toast({
          title: "Variété supprimée",
          description: `La variété "${variety.name}" a été supprimée avec succès`,
          variant: "default",
        });
        
        fetchVarieties();
      } catch (error) {
        console.error("Error deleting variety:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de la variété",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Gestion des variétés</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle variété
        </Button>
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Chargement des variétés...</div>
      ) : (
        <VarietyTable 
          varieties={varieties} 
          currentSessionVarieties={currentSession?.selectedVarieties || []}
          onEdit={openEditDialog} 
          onDelete={handleDeleteVariety} 
        />
      )}
      
      <VarietyFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSaveVariety}
        variety={editingVariety}
      />
    </>
  );
};

export default VarietyList;
