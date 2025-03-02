
import React from "react";
import { Button } from "@/components/ui/button";
import { Droplet, Leaf, Flower2, Zap } from "lucide-react";
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
import type { FertilizerType } from "@/types";

const FertilizerButtons = () => {
  const { selectedPlantIds, selectedSpaceId, getSpaceById, updatePlantsBatchState } = useCultivation();
  const [selectedFertilizer, setSelectedFertilizer] = React.useState<FertilizerType>("base");
  const [dosage, setDosage] = React.useState<string>("1.0");
  const [unitType, setUnitType] = React.useState<"ml/L" | "g/L">("ml/L");

  const handleApplyFertilizer = () => {
    if (!selectedPlantIds.length && !selectedSpaceId) {
      toast({
        title: "Aucune sélection",
        description: "Sélectionnez des plantes ou un espace pour appliquer l'engrais",
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
      description: `${getFertilizerName(selectedFertilizer)} appliqué à ${dosage} ${unitType} sur ${plantsLabel}`,
      variant: "default",
    });
  };

  const getFertilizerName = (type: FertilizerType): string => {
    switch (type) {
      case "base": return "Engrais de base";
      case "growth": return "Engrais de croissance";
      case "bloom": return "Engrais de floraison";
      case "booster": return "Booster";
      default: return "Engrais";
    }
  };

  const getFertilizerIcon = (type: FertilizerType) => {
    switch (type) {
      case "base": return <Droplet />;
      case "growth": return <Leaf />;
      case "bloom": return <Flower2 />;
      case "booster": return <Zap />;
      default: return <Droplet />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Engrais et boosters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fertilizer-type">Type d'engrais</Label>
          <Select 
            value={selectedFertilizer} 
            onValueChange={(value) => setSelectedFertilizer(value as FertilizerType)}
          >
            <SelectTrigger id="fertilizer-type">
              <SelectValue placeholder="Choisir un type d'engrais" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="base">Engrais de base</SelectItem>
              <SelectItem value="growth">Engrais de croissance</SelectItem>
              <SelectItem value="bloom">Engrais de floraison</SelectItem>
              <SelectItem value="booster">Booster</SelectItem>
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
            <Select 
              value={unitType} 
              onValueChange={(value) => setUnitType(value as "ml/L" | "g/L")}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ml/L">ml/L</SelectItem>
                <SelectItem value="g/L">g/L</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          variant="success" 
          onClick={handleApplyFertilizer} 
          className="w-full"
        >
          {getFertilizerIcon(selectedFertilizer)}
          Appliquer {getFertilizerName(selectedFertilizer)}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FertilizerButtons;
