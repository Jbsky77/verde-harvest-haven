
import { useState, useEffect } from "react";
import { PlantVariety } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface VarietyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (varietyData: Omit<PlantVariety, "id">) => void;
  currentVariety: PlantVariety | null;
  isEditing: boolean;
}

const VarietyDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentVariety, 
  isEditing 
}: VarietyDialogProps) => {
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#9b87f5");
  const [newGerminationTime, setNewGerminationTime] = useState<number | undefined>(undefined);
  const [newGrowthTime, setNewGrowthTime] = useState<number | undefined>(undefined);
  const [newFloweringTime, setNewFloweringTime] = useState<number | undefined>(undefined);
  const [newDryWeight, setNewDryWeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (currentVariety) {
      setNewName(currentVariety.name);
      setNewColor(currentVariety.color);
      setNewGerminationTime(currentVariety.germinationTime);
      setNewGrowthTime(currentVariety.growthTime);
      setNewFloweringTime(currentVariety.floweringTime);
      setNewDryWeight(currentVariety.dryWeight);
    } else {
      setNewName("");
      setNewColor("#9b87f5");
      setNewGerminationTime(undefined);
      setNewGrowthTime(undefined);
      setNewFloweringTime(undefined);
      setNewDryWeight(undefined);
    }
  }, [currentVariety, isOpen]);

  const handleSubmit = () => {
    if (!newName.trim()) {
      toast.error("Le nom de la variété est requis");
      return;
    }

    const varietyData = {
      name: newName,
      color: newColor,
      germinationTime: newGerminationTime,
      growthTime: newGrowthTime,
      floweringTime: newFloweringTime,
      dryWeight: newDryWeight
    };

    onSubmit(varietyData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Modifier ${currentVariety?.name}` : "Nouvelle variété"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom de la variété"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Couleur</Label>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full border border-gray-200" 
                style={{ backgroundColor: newColor }} 
              />
              <Input
                id="color"
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="germinationTime">Temps de germination (jours)</Label>
            <Input
              id="germinationTime"
              type="number"
              min="1"
              value={newGerminationTime || ""}
              onChange={(e) => setNewGerminationTime(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ex: 5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="growthTime">Temps de croissance (jours)</Label>
            <Input
              id="growthTime"
              type="number"
              min="1"
              value={newGrowthTime || ""}
              onChange={(e) => setNewGrowthTime(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ex: 30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="floweringTime">Temps de floraison (jours)</Label>
            <Input
              id="floweringTime"
              type="number"
              min="1"
              value={newFloweringTime || ""}
              onChange={(e) => setNewFloweringTime(e.target.value ? Number(e.target.value) : undefined)}
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
              value={newDryWeight || ""}
              onChange={(e) => setNewDryWeight(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ex: 120.5"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VarietyDialog;
