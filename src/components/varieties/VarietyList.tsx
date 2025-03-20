
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
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const { toast } = useToast();

  // Fetch varieties on component mount
  useEffect(() => {
    fetchVarieties();
  }, []);

  const fetchVarieties = async () => {
    try {
      setIsLoading(true);
      
      // Try to get varieties from Firebase
      const fetchedVarieties = await getVarieties();
      setVarieties(fetchedVarieties);
      setUseLocalStorage(false);

    } catch (error) {
      console.error("Error fetching varieties:", error);
      
      // If Firebase error, check if we have varieties in localStorage
      try {
        const localVarieties = localStorage.getItem('varieties');
        if (localVarieties) {
          setVarieties(JSON.parse(localVarieties));
        }
        setUseLocalStorage(true);
        toast({
          title: "Mode local activé",
          description: "Firebase n'est pas accessible, les variétés sont stockées localement",
          variant: "default",
        });
      } catch (localError) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les variétés",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocalStorage = (updatedVarieties: PlantVariety[]) => {
    localStorage.setItem('varieties', JSON.stringify(updatedVarieties));
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
      if (useLocalStorage) {
        // Local storage mode
        const updatedVarieties = [...varieties];
        
        if (editingVariety) {
          // Update existing variety
          const index = updatedVarieties.findIndex(v => v.id === editingVariety.id);
          if (index !== -1) {
            updatedVarieties[index] = { ...varietyData, id: editingVariety.id };
          }
          toast({
            title: "Variété mise à jour",
            description: `La variété "${varietyData.name}" a été mise à jour`,
            variant: "default",
          });
        } else {
          // Create new variety
          const newId = `var-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          updatedVarieties.push({ ...varietyData, id: newId });
          toast({
            title: "Variété créée",
            description: `La nouvelle variété "${varietyData.name}" a été créée`,
            variant: "default",
          });
        }
        
        setVarieties(updatedVarieties);
        saveToLocalStorage(updatedVarieties);
        setIsDialogOpen(false);
        return;
      }
      
      // Firebase mode
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
      
      // If Firebase error, switch to local storage
      setUseLocalStorage(true);
      toast({
        title: "Passage au mode local",
        description: "Impossible de se connecter à Firebase, les données sont maintenant stockées localement",
        variant: "warning",
      });
      
      // Retry with local storage
      handleSaveVariety(varietyData);
    }
  };

  const handleDeleteVariety = async (variety: PlantVariety) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la variété "${variety.name}" ?`)) {
      try {
        if (useLocalStorage) {
          // Local storage mode
          const updatedVarieties = varieties.filter(v => v.id !== variety.id);
          setVarieties(updatedVarieties);
          saveToLocalStorage(updatedVarieties);
          
          toast({
            title: "Variété supprimée",
            description: `La variété "${variety.name}" a été supprimée avec succès`,
            variant: "default",
          });
          return;
        }
        
        // Firebase mode
        await deleteVariety(variety.id);
        
        toast({
          title: "Variété supprimée",
          description: `La variété "${variety.name}" a été supprimée avec succès`,
          variant: "default",
        });
        
        fetchVarieties();
      } catch (error) {
        console.error("Error deleting variety:", error);
        
        // If Firebase error, switch to local storage
        setUseLocalStorage(true);
        toast({
          title: "Passage au mode local",
          description: "Impossible de se connecter à Firebase, les données sont maintenant stockées localement",
          variant: "warning",
        });
        
        // Retry with local storage
        handleDeleteVariety(variety);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium">Gestion des variétés</h2>
          {useLocalStorage && (
            <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
              Mode local
            </Badge>
          )}
        </div>
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
