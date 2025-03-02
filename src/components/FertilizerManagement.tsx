import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Droplets } from "lucide-react";
import { useCultivation } from "@/context/CultivationContext";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import FertilizerManagementDialog from "./FertilizerManagementDialog";
import { FertilizerType } from "@/types";
import { FertilizerTypeLabels } from "./fertilizer/FertilizerForm";

const FertilizerManagement = () => {
  const { fertilizers, selectedPlantIds, getPlantById, updatePlantBatch } = useCultivation();
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [selectedFertilizerId, setSelectedFertilizerId] = useState<string>("");
  
  const handleApplyFertilizer = () => {
    if (!selectedPlantIds.length) {
      toast({
        title: "Aucune sélection",
        description: "Sélectionnez des plantes pour appliquer l'engrais",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFertilizerId) {
      toast({
        title: "Aucun engrais sélectionné",
        description: "Veuillez sélectionner un engrais",
        variant: "destructive",
      });
      return;
    }

    const fertilizer = fertilizers.find(f => f.id === selectedFertilizerId);
    if (!fertilizer) return;

    const updatedPlants = selectedPlantIds.map(id => {
      const plant = getPlantById(id);
      if (!plant) return null;
      return {
        ...plant,
        lastUpdated: new Date()
      };
    }).filter(Boolean);
    
    if (updatedPlants.length > 0) {
      updatePlantBatch(updatedPlants as any);
      toast({
        title: "Engrais appliqué",
        description: `${fertilizer.name} appliqué à ${updatedPlants.length} plantes`,
        variant: "success",
      });
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Engrais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fertilizer-select">Sélectionner un engrais</Label>
            <Select 
              value={selectedFertilizerId} 
              onValueChange={setSelectedFertilizerId}
            >
              <SelectTrigger id="fertilizer-select">
                <SelectValue placeholder="Choisir un engrais" />
              </SelectTrigger>
              <SelectContent>
                {fertilizers.map((fertilizer) => (
                  <SelectItem key={fertilizer.id} value={fertilizer.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: fertilizer.color || '#9b87f5' }}
                      />
                      {fertilizer.name} ({FertilizerTypeLabels[fertilizer.type]})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="success" 
              onClick={handleApplyFertilizer}
              disabled={!selectedFertilizerId}
            >
              <Droplets className="h-4 w-4 mr-2" />
              Appliquer
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setIsManagementOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Gérer
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isManagementOpen} onOpenChange={setIsManagementOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des engrais</DialogTitle>
          </DialogHeader>
          
          <FertilizerManagementDialog />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FertilizerManagement;
