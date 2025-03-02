
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw, BarChart, Save } from "lucide-react";
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

const SettingsButtons = () => {
  const { 
    selectedPlantIds, 
    selectedSpaceId, 
    getSpaceById, 
    updatePlantEC,
    updatePlantPH,
    getPlantById
  } = useCultivation();
  
  const [ec, setEc] = React.useState<string>("1.2");
  const [ph, setPh] = React.useState<string>("6.0");

  const handleUpdateParameters = () => {
    if (!selectedPlantIds.length && !selectedSpaceId) {
      toast({
        title: "Aucune sélection",
        description: "Sélectionnez des plantes ou un espace pour mettre à jour les paramètres",
        variant: "destructive",
      });
      return;
    }

    const ecValue = parseFloat(ec);
    const phValue = parseFloat(ph);

    if (isNaN(ecValue) || isNaN(phValue)) {
      toast({
        title: "Valeurs invalides",
        description: "Veuillez entrer des valeurs numériques valides pour EC et pH",
        variant: "destructive",
      });
      return;
    }

    // Mise à jour des plantes sélectionnées
    if (selectedPlantIds.length > 0) {
      selectedPlantIds.forEach(id => {
        updatePlantEC(id, ecValue);
        updatePlantPH(id, phValue);
      });
      
      toast({
        title: "Paramètres mis à jour",
        description: `EC: ${ecValue}, pH: ${phValue} appliqués à ${selectedPlantIds.length} plantes`,
        variant: "default",
      });
    }
  };

  const handleGenerateReport = () => {
    toast({
      title: "Génération de rapport",
      description: "La fonctionnalité de génération de rapport sera disponible prochainement",
    });
  };

  const handleRefreshSettings = () => {
    if (selectedPlantIds.length === 1) {
      const plant = getPlantById(selectedPlantIds[0]);
      if (plant) {
        setEc(plant.ec.toString());
        setPh(plant.ph.toString());
        toast({
          title: "Paramètres actualisés",
          description: `Paramètres chargés depuis la plante sélectionnée (EC: ${plant.ec}, pH: ${plant.ph})`,
        });
      }
    } else {
      setEc("1.2");
      setPh("6.0");
      toast({
        title: "Paramètres réinitialisés",
        description: "Les valeurs par défaut ont été restaurées",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Paramètres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ec-value">Valeur EC</Label>
          <Input
            id="ec-value"
            type="number"
            step="0.1"
            min="0.1"
            max="3.0"
            value={ec}
            onChange={(e) => setEc(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ph-value">Valeur pH</Label>
          <Input
            id="ph-value"
            type="number"
            step="0.1"
            min="5.0"
            max="7.0"
            value={ph}
            onChange={(e) => setPh(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="success" 
            onClick={handleUpdateParameters}
          >
            <Save />
            Appliquer
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleRefreshSettings}
          >
            <RefreshCw />
            Actualiser
          </Button>
        </div>
        
        <Button 
          variant="secondary"
          onClick={handleGenerateReport}
          className="w-full"
        >
          <BarChart />
          Générer rapport
        </Button>
      </CardContent>
    </Card>
  );
};

export default SettingsButtons;
