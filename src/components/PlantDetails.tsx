
import { useState } from "react";
import { Plant, PlantState } from "@/types";
import { Button } from "@/components/ui/button";
import { useCultivation } from "@/context/CultivationContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  PlantPositionFields,
  VarietySelector,
  StateSelector,
  SliderField,
  NotesField,
  EstimatedDates
} from "@/components/plant-details";

type PlantDetailsProps = {
  plant: Plant;
  onUpdate: (plant: Plant) => void;
};

const PlantDetails = ({ plant, onUpdate }: PlantDetailsProps) => {
  const { varieties, getEstimatedFloweringDate, getEstimatedHarvestDate } = useCultivation();
  const [formState, setFormState] = useState<Plant>(plant);
  
  const handleChange = (field: keyof Plant, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      lastUpdated: new Date()
    }));
  };
  
  const handleVarietyChange = (varietyId: string) => {
    const selectedVariety = varieties.find(v => v.id === varietyId);
    if (selectedVariety) {
      setFormState(prev => ({
        ...prev,
        variety: selectedVariety,
        lastUpdated: new Date()
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formState);
  };
  
  const floweringDate = getEstimatedFloweringDate(plant.id);
  const harvestDate = getEstimatedHarvestDate(plant.id);
  
  const formatDate = (date: Date | null) => {
    if (!date) return "Non disponible";
    return format(date, "PPP", { locale: fr });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <PlantPositionFields plant={formState} />
      
      <div className="space-y-4">
        <VarietySelector 
          variety={formState.variety} 
          varieties={varieties} 
          onVarietyChange={handleVarietyChange} 
        />
        
        <StateSelector 
          state={formState.state} 
          onStateChange={(value) => handleChange("state", value)} 
        />
        
        <SliderField 
          id="ec"
          label="EC"
          value={formState.ec}
          min={0.5}
          max={2.5}
          step={0.01}
          onChange={(value) => handleChange("ec", value)}
        />
        
        <SliderField 
          id="ph"
          label="pH"
          value={formState.ph}
          min={5.0}
          max={7.0}
          step={0.01}
          onChange={(value) => handleChange("ph", value)}
        />
        
        <NotesField 
          notes={formState.notes} 
          onChange={(value) => handleChange("notes", value)} 
        />
        
        <EstimatedDates 
          floweringDate={floweringDate}
          harvestDate={harvestDate}
          formatDate={formatDate}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};

export default PlantDetails;
