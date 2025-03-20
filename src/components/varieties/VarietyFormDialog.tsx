
import React, { useState, useEffect } from "react";
import { PlantVariety } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface VarietyFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (varietyData: Omit<PlantVariety, "id">) => void;
  variety: PlantVariety | null;
}

const VarietyFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  variety
}: VarietyFormDialogProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#9b87f5");
  const [germinationTime, setGerminationTime] = useState<number | undefined>(undefined);
  const [growthTime, setGrowthTime] = useState<number | undefined>(undefined);
  const [floweringTime, setFloweringTime] = useState<number | undefined>(undefined);
  const [dryWeight, setDryWeight] = useState<number | undefined>(undefined);

  // Initialize form with variety data if editing
  useEffect(() => {
    if (variety) {
      setName(variety.name);
      setColor(variety.color);
      setGerminationTime(variety.germinationTime);
      setGrowthTime(variety.growthTime);
      setFloweringTime(variety.floweringTime);
      setDryWeight(variety.dryWeight);
    } else {
      resetForm();
    }
  }, [variety, isOpen]);

  const resetForm = () => {
    setName("");
    setColor("#9b87f5");
    setGerminationTime(undefined);
    setGrowthTime(undefined);
    setFloweringTime(undefined);
    setDryWeight(undefined);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    onSubmit({
      name,
      color,
      germinationTime,
      growthTime,
      floweringTime,
      dryWeight
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {variety ? `Modifier ${variety.name}` : "Nouvelle variété"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de la variété"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Couleur</Label>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full border border-gray-200" 
                style={{ backgroundColor: color }} 
              />
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
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
              value={germinationTime || ""}
              onChange={(e) => setGerminationTime(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ex: 5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="growthTime">Temps de croissance (jours)</Label>
            <Input
              id="growthTime"
              type="number"
              min="1"
              value={growthTime || ""}
              onChange={(e) => setGrowthTime(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Ex: 30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="floweringTime">Temps de floraison (jours)</Label>
            <Input
              id="floweringTime"
              type="number"
              min="1"
              value={floweringTime || ""}
              onChange={(e) => setFloweringTime(e.target.value ? Number(e.target.value) : undefined)}
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
              value={dryWeight || ""}
              onChange={(e) => setDryWeight(e.target.value ? Number(e.target.value) : undefined)}
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
            {variety ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VarietyFormDialog;
