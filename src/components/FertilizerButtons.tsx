import React from "react";
import { Button } from "@/components/ui/button";
import { Droplet, Leaf, Flower2, Zap, Beaker } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Fertilizer } from "@/types";
import FertilizerManagement from "./FertilizerManagement";

const FertilizerButtons = () => {
  const { 
    selectedPlantIds, 
    selectedSpaceId, 
    getSpaceById, 
    fertilizers
  } = useCultivation();

  const [selectedFertilizerId, setSelectedFertilizerId] = React.useState<string>("");
  const [dosage, setDosage] = React.useState<string>("1.0");

  const selectedFertilizer = fertilizers.find(f => f.id === selectedFertilizerId);

  React.useEffect(() => {
    if (selectedFertilizer) {
      setDosage(selectedFertilizer.recommendedDosage.toString());
    }
  }, [selectedFertilizerId, selectedFertilizer]);

  const handleApplyFertilizer = () => {
    if (!selectedPlantIds.length && !selectedSpaceId) {
      toast({
        title: "Aucune sélection",
        description: "Sélectionnez des plantes ou un espace pour appliquer l'engrais",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFertilizer) {
      toast({
        title: "Aucun engrais sélectionné",
        description: "Veuillez sélectionner un engrais à appliquer",
        variant: "destructive",
      });
      return;
    }

    const spaceLabel = selectedSpaceId ? getSpaceById(selectedSpaceId)?.name : "";
    const plantsLabel = selectedPlantIds.length > 0 
      ? `${selectedPlantIds.length} plantes`
      : `toutes les plantes de ${spaceLabel}`;

    toast({
      title: "Engrais appliqué",
      description: `${selectedFertilizer.name} appliqué à ${dosage} ${selectedFertilizer.unitType} sur ${plantsLabel}`,
      variant: "success",
    });
  };

  const getFertilizerIcon = (fertilizer: Fertilizer) => {
    switch (fertilizer.type) {
      case "base": return <Droplet />;
      case "growth": return <Leaf />;
      case "bloom": return <Flower2 />;
      case "booster": return <Zap />;
      case "custom": return <Beaker />;
      default: return <Droplet />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Engrais et boosters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fertilizer-type">Sélectionner un engrais</Label>
            <Select 
              value={selectedFertilizerId} 
              onValueChange={setSelectedFertilizerId}
            >
              <SelectTrigger id="fertilizer-type">
                <SelectValue placeholder="Choisir un engrais" />
              </SelectTrigger>
              <SelectContent>
                {fertilizers.map(fertilizer => (
                  <SelectItem key={fertilizer.id} value={fertilizer.id}>
                    <div className="flex items-center">
                      {getFertilizerIcon(fertilizer)}
                      <span className="ml-2">{fertilizer.name}</span>
                      {fertilizer.isCustom && <span className="ml-2 text-xs text-muted-foreground">(Personnalisé)</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fertilizer-dosage">Dosage</Label>
            <div className="flex space-x-2">
              <Input
                id="fertilizer-dosage"
                type="number"
                step="0.1"
                min="0.1"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="flex-1"
              />
              <div className="w-24 flex items-center justify-center border rounded-md bg-muted">
                {selectedFertilizer?.unitType || "ml/L"}
              </div>
            </div>
          </div>
          
          <Button 
            variant="success" 
            onClick={handleApplyFertilizer} 
            className="w-full"
            disabled={!selectedFertilizerId}
          >
            {selectedFertilizer && getFertilizerIcon(selectedFertilizer)}
            Appliquer {selectedFertilizer ? selectedFertilizer.name : "l'engrais"}
          </Button>
        </CardContent>
      </Card>
      
      <FertilizerManagement />
    </div>
  );
};

export default FertilizerButtons;
