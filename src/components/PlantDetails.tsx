
import { useState } from "react";
import { Plant, PlantState, PlantVariety } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCultivation } from "@/context/CultivationContext";
import { Slider } from "@/components/ui/slider";

type PlantDetailsProps = {
  plant: Plant;
  onUpdate: (plant: Plant) => void;
};

const stateOptions: { value: PlantState; label: string }[] = [
  { value: "germination", label: "Germination" },
  { value: "growth", label: "Croissance" },
  { value: "flowering", label: "Floraison" },
  { value: "drying", label: "Séchage" },
  { value: "harvested", label: "Récolté" }
];

const PlantDetails = ({ plant, onUpdate }: PlantDetailsProps) => {
  const { varieties } = useCultivation();
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="space">Espace</Label>
          <Input 
            id="space" 
            value={`Espace ${formState.position.space}`} 
            disabled 
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input 
            id="position" 
            value={`L${formState.position.row} - C${formState.position.column}`} 
            disabled 
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="variety">Variété</Label>
          <Select 
            value={formState.variety.id}
            onValueChange={handleVarietyChange}
          >
            <SelectTrigger>
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
        
        <div>
          <Label htmlFor="state">État</Label>
          <Select 
            value={formState.state}
            onValueChange={(value: PlantState) => handleChange("state", value)}
          >
            <SelectTrigger>
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
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="ec">EC</Label>
            <span className="text-sm font-medium">{formState.ec.toFixed(1)}</span>
          </div>
          <Slider
            id="ec"
            min={0.5}
            max={2.5}
            step={0.1}
            value={[formState.ec]}
            onValueChange={(values) => handleChange("ec", values[0])}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="ph">pH</Label>
            <span className="text-sm font-medium">{formState.ph.toFixed(1)}</span>
          </div>
          <Slider
            id="ph"
            min={5.0}
            max={7.0}
            step={0.1}
            value={[formState.ph]}
            onValueChange={(values) => handleChange("ph", values[0])}
          />
        </div>
        
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Input 
            id="notes" 
            value={formState.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};

export default PlantDetails;
