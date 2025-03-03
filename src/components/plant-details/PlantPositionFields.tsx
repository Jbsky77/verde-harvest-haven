
import { Plant } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type PlantPositionFieldsProps = {
  plant: Plant;
};

export const PlantPositionFields = ({ plant }: PlantPositionFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <Label htmlFor="space">Espace</Label>
        <Input 
          id="space" 
          value={`Espace ${plant.position.space}`} 
          disabled 
        />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Input 
          id="position" 
          value={`L${plant.position.row} - C${plant.position.column}`} 
          disabled 
        />
      </div>
    </div>
  );
};
