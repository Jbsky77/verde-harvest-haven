
import { useCultivation } from "@/context/CultivationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { PlantState } from "@/types";
import { toast } from "@/components/ui/use-toast";

const stateOptions: { value: PlantState; label: string }[] = [
  { value: "germination", label: "Germination" },
  { value: "growth", label: "Croissance" },
  { value: "flowering", label: "Floraison" },
  { value: "drying", label: "Séchage" },
  { value: "harvested", label: "Récolté" }
];

const BatchActions = () => {
  const { 
    selectedSpaceId, 
    updatePlantsInSpace, 
    updatePlantsInRow, 
    getSpaceById,
    addAlert,
    setSelectedPlantIds,
    selectedPlantIds,
    updatePlantsBatchState,
    varieties
  } = useCultivation();
  
  const [selectedRow, setSelectedRow] = useState<number>(1);
  const [ec, setEc] = useState<number>(1.2);
  const [ph, setPh] = useState<number>(6.0);
  const [state, setState] = useState<PlantState>("germination");
  const [varietyId, setVarietyId] = useState<string>("");
  
  if (!selectedSpaceId) return null;
  
  const space = getSpaceById(selectedSpaceId);
  if (!space) return null;
  
  const handleApplyToSpace = () => {
    updatePlantsInSpace(selectedSpaceId, {
      ec,
      ph
    });
    
    addAlert({
      type: "success",
      message: `EC et pH mis à jour pour toutes les plantes de l'Espace ${selectedSpaceId}`,
      spaceId: selectedSpaceId
    });
    
    toast({
      title: "Mise à jour appliquée",
      description: `EC et pH mis à jour pour toutes les plantes de l'Espace ${selectedSpaceId}`,
      variant: "success"
    });
  };
  
  const handleApplyToRow = () => {
    if (!selectedRow) return;
    
    updatePlantsInRow(selectedSpaceId, selectedRow, {
      ec,
      ph
    });
    
    addAlert({
      type: "success",
      message: `EC et pH mis à jour pour la Ligne ${selectedRow} de l'Espace ${selectedSpaceId}`,
      spaceId: selectedSpaceId
    });
    
    toast({
      title: "Mise à jour appliquée",
      description: `EC et pH mis à jour pour la Ligne ${selectedRow} de l'Espace ${selectedSpaceId}`,
      variant: "success"
    });
  };
  
  const handleUpdateSelectedPlants = () => {
    if (selectedPlantIds.length === 0) {
      toast({
        title: "Aucune plante sélectionnée",
        description: "Veuillez sélectionner des plantes à mettre à jour",
        variant: "destructive"
      });
      return;
    }
    
    updatePlantsBatchState(selectedPlantIds, state);
    
    addAlert({
      type: "success",
      message: `État mis à jour pour ${selectedPlantIds.length} plantes sélectionnées`,
      spaceId: selectedSpaceId
    });
    
    toast({
      title: "Mise à jour appliquée",
      description: `État mis à jour pour ${selectedPlantIds.length} plantes sélectionnées`,
      variant: "success"
    });
    
    setSelectedPlantIds([]);
  };
  
  const rowOptions = Array.from({ length: space.rows }, (_, i) => i + 1);
  
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium mb-4">Actions groupées</h3>
      
      <Tabs defaultValue="space">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="space">Espace entier</TabsTrigger>
          <TabsTrigger value="row">Par ligne</TabsTrigger>
          <TabsTrigger value="selected">Sélection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="space" className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="space-ec">EC</Label>
              <span className="text-sm font-medium">{ec.toFixed(1)}</span>
            </div>
            <Slider
              id="space-ec"
              min={0.5}
              max={2.5}
              step={0.1}
              value={[ec]}
              onValueChange={(values) => setEc(values[0])}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="space-ph">pH</Label>
              <span className="text-sm font-medium">{ph.toFixed(1)}</span>
            </div>
            <Slider
              id="space-ph"
              min={5.0}
              max={7.0}
              step={0.1}
              value={[ph]}
              onValueChange={(values) => setPh(values[0])}
            />
          </div>
          
          <Button onClick={handleApplyToSpace} className="w-full">
            Appliquer à tout l'espace
          </Button>
        </TabsContent>
        
        <TabsContent value="row" className="space-y-4">
          <div>
            <Label htmlFor="row-select" className="mb-2 block">Ligne</Label>
            <Select
              value={selectedRow.toString()}
              onValueChange={(value) => setSelectedRow(parseInt(value))}
            >
              <SelectTrigger id="row-select">
                <SelectValue placeholder="Sélectionner une ligne" />
              </SelectTrigger>
              <SelectContent>
                {rowOptions.map((row) => (
                  <SelectItem key={row} value={row.toString()}>
                    Ligne {row}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="row-ec">EC</Label>
              <span className="text-sm font-medium">{ec.toFixed(1)}</span>
            </div>
            <Slider
              id="row-ec"
              min={0.5}
              max={2.5}
              step={0.1}
              value={[ec]}
              onValueChange={(values) => setEc(values[0])}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="row-ph">pH</Label>
              <span className="text-sm font-medium">{ph.toFixed(1)}</span>
            </div>
            <Slider
              id="row-ph"
              min={5.0}
              max={7.0}
              step={0.1}
              value={[ph]}
              onValueChange={(values) => setPh(values[0])}
            />
          </div>
          
          <Button onClick={handleApplyToRow} className="w-full">
            Appliquer à la ligne {selectedRow}
          </Button>
        </TabsContent>
        
        <TabsContent value="selected" className="space-y-4">
          <div>
            <Label className="mb-2 block">
              {selectedPlantIds.length} plantes sélectionnées
            </Label>
          </div>
          
          <div>
            <Label htmlFor="selected-state" className="mb-2 block">État</Label>
            <Select
              value={state}
              onValueChange={(value: PlantState) => setState(value)}
            >
              <SelectTrigger id="selected-state">
                <SelectValue placeholder="Sélectionner un état" />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map(option => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="selected-variety" className="mb-2 block">Variété</Label>
            <Select
              value={varietyId}
              onValueChange={setVarietyId}
            >
              <SelectTrigger id="selected-variety">
                <SelectValue placeholder="Sélectionner une variété" />
              </SelectTrigger>
              <SelectContent>
                {varieties.map(variety => (
                  <SelectItem 
                    key={variety.id} 
                    value={variety.id}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: variety.color }} 
                      />
                      <span>{variety.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleUpdateSelectedPlants} 
            className="w-full"
            disabled={selectedPlantIds.length === 0}
          >
            Appliquer aux plantes sélectionnées
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchActions;
