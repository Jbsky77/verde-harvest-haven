
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCultivation } from "@/context/CultivationContext";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Fertilizer } from "@/types";
import FertilizerTable from "./fertilizer/FertilizerTable";
import FertilizerForm from "./fertilizer/FertilizerForm";
import { getRandomColor } from "./fertilizer/FertilizerConstants";

const FertilizerManagementDialog = () => {
  const { fertilizers, addFertilizer, updateFertilizer, deleteFertilizer } = useCultivation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFertilizer, setEditingFertilizer] = useState<Fertilizer | null>(null);
  
  const [name, setName] = useState("");
  const [type, setType] = useState<"base" | "growth" | "bloom" | "booster" | "custom">("custom");
  const [unitType, setUnitType] = useState<"ml/L" | "g/L">("ml/L");
  const [recommendedDosage, setRecommendedDosage] = useState<string>("1.0");
  const [color, setColor] = useState<string>("");
  
  const openNewFertilizerDialog = () => {
    setEditingFertilizer(null);
    setName("");
    setType("custom");
    setUnitType("ml/L");
    setRecommendedDosage("1.0");
    setColor(getRandomColor());
    setIsDialogOpen(true);
  };
  
  const openEditFertilizerDialog = (fertilizer: Fertilizer) => {
    setEditingFertilizer(fertilizer);
    setName(fertilizer.name);
    setType(fertilizer.type);
    setUnitType(fertilizer.unitType);
    setRecommendedDosage(fertilizer.recommendedDosage.toString());
    setColor(fertilizer.color || getRandomColor());
    setIsDialogOpen(true);
  };
  
  const handleSaveFertilizer = () => {
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour l'engrais",
        variant: "destructive",
      });
      return;
    }
    
    const dosage = parseFloat(recommendedDosage);
    if (isNaN(dosage) || dosage <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un dosage valide",
        variant: "destructive",
      });
      return;
    }
    
    if (editingFertilizer) {
      // Update existing fertilizer
      updateFertilizer({
        ...editingFertilizer,
        name,
        type,
        unitType,
        recommendedDosage: dosage,
        color,
      });
      
      toast({
        title: "Engrais mis à jour",
        description: `L'engrais "${name}" a été mis à jour avec succès`,
        variant: "success",
      });
    } else {
      // Add new fertilizer
      addFertilizer({
        name,
        type,
        unitType,
        recommendedDosage: dosage,
        color,
      });
      
      toast({
        title: "Engrais ajouté",
        description: `L'engrais "${name}" a été ajouté avec succès`,
        variant: "success",
      });
    }
    
    setIsDialogOpen(false);
  };
  
  const handleDeleteFertilizer = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'engrais "${name}" ?`)) {
      deleteFertilizer(id);
      
      toast({
        title: "Engrais supprimé",
        description: `L'engrais "${name}" a été supprimé avec succès`,
        variant: "default",
      });
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Gestion des engrais</h2>
        <Button onClick={openNewFertilizerDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvel engrais
        </Button>
      </div>
      
      <FertilizerTable 
        fertilizers={fertilizers}
        onEdit={openEditFertilizerDialog}
        onDelete={handleDeleteFertilizer}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingFertilizer ? "Modifier l'engrais" : "Nouvel engrais"}
            </DialogTitle>
          </DialogHeader>
          
          <FertilizerForm
            name={name}
            setName={setName}
            type={type}
            setType={setType}
            unitType={unitType}
            setUnitType={setUnitType}
            recommendedDosage={recommendedDosage}
            setRecommendedDosage={setRecommendedDosage}
            color={color}
            setColor={setColor}
          />
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSaveFertilizer}>
              {editingFertilizer ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FertilizerManagementDialog;
