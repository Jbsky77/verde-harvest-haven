
import React from "react";
import { Button } from "@/components/ui/button";
import { Sprout, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCultivation } from "@/context/CultivationContext";
import { toast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlantVariety } from "@/types";

const VarietyButtons = () => {
  const { 
    selectedPlantIds, 
    selectedSpaceId, 
    getSpaceById, 
    varieties,
    updatePlantBatch,
    getPlantById
  } = useCultivation();
  
  const [selectedVarietyId, setSelectedVarietyId] = React.useState<string>("");

  const handleApplyVariety = () => {
    if (!selectedPlantIds.length && !selectedSpaceId) {
      toast({
        title: "Aucune sélection",
        description: "Sélectionnez des plantes ou un espace pour changer la variété",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVarietyId) {
      toast({
        title: "Aucune variété sélectionnée",
        description: "Veuillez sélectionner une variété",
        variant: "destructive",
      });
      return;
    }

    const variety = varieties.find(v => v.id === selectedVarietyId);
    if (!variety) return;

    // Mise à jour des plantes sélectionnées
    if (selectedPlantIds.length > 0) {
      const updatedPlants = selectedPlantIds.map(id => {
        const plant = getPlantById(id);
        if (!plant) return null;
        return {
          ...plant,
          variety,
          lastUpdated: new Date()
        };
      }).filter(Boolean);
      
      if (updatedPlants.length > 0) {
        updatePlantBatch(updatedPlants as any);
        toast({
          title: "Variété mise à jour",
          description: `${variety.name} appliquée à ${updatedPlants.length} plantes`,
          variant: "default",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Variétés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="variety-select">Variété</Label>
          <Select 
            value={selectedVarietyId} 
            onValueChange={setSelectedVarietyId}
          >
            <SelectTrigger id="variety-select">
              <SelectValue placeholder="Choisir une variété" />
            </SelectTrigger>
            <SelectContent>
              {varieties.map((variety) => (
                <SelectItem key={variety.id} value={variety.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: variety.color }}
                    />
                    {variety.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="success" 
            onClick={handleApplyVariety}
            disabled={!selectedVarietyId}
          >
            <Sprout />
            Appliquer
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              toast({
                title: "Gestion des variétés",
                description: "La fonctionnalité de gestion des variétés sera disponible bientôt",
              });
            }}
          >
            <Edit />
            Gérer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VarietyButtons;
