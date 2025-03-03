
import { Plant, PlantVariety } from "@/types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type VarietySelectorProps = {
  variety: PlantVariety;
  varieties: PlantVariety[];
  onVarietyChange: (varietyId: string) => void;
};

export const VarietySelector = ({ variety, varieties, onVarietyChange }: VarietySelectorProps) => {
  return (
    <div>
      <Label htmlFor="variety">Variété</Label>
      <Select 
        value={variety.id}
        onValueChange={onVarietyChange}
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
  );
};
