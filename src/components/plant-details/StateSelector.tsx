
import { PlantState } from "@/types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { stateOptions } from "./constants";

type StateSelectorProps = {
  state: PlantState;
  onStateChange: (state: PlantState) => void;
};

export const StateSelector = ({ state, onStateChange }: StateSelectorProps) => {
  return (
    <div>
      <Label htmlFor="state">État</Label>
      <Select 
        value={state}
        onValueChange={onStateChange}
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
  );
};
