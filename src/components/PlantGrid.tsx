
import { useState } from "react";
import { CultivationSpace, Plant, PlantState } from "@/types";
import { useCultivation } from "@/context/CultivationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PlantDetails from "@/components/PlantDetails";
import { cn } from "@/lib/utils";

type PlantCellProps = {
  plant: Plant;
  onClick: (plant: Plant) => void;
};

const stateBorderColors = {
  germination: "border-purple-300",
  growth: "border-blue-300",
  flowering: "border-pink-300",
  drying: "border-orange-300",
  harvested: "border-green-300"
};

const stateBackgroundColors = {
  germination: "bg-purple-50",
  growth: "bg-blue-50",
  flowering: "bg-pink-50",
  drying: "bg-orange-50",
  harvested: "bg-green-50"
};

const PlantCell = ({ plant, onClick }: PlantCellProps) => {
  const { variety, state } = plant;
  
  return (
    <button
      className={cn(
        "w-8 h-8 border rounded-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/40",
        stateBorderColors[state],
        stateBackgroundColors[state]
      )}
      style={{ backgroundColor: variety.color + "20", borderColor: variety.color }}
      onClick={() => onClick(plant)}
      title={`Variété: ${variety.name}, État: ${state}`}
    />
  );
};

type PlantGridProps = {
  space: CultivationSpace;
};

const PlantGrid = ({ space }: PlantGridProps) => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const { updatePlant } = useCultivation();
  
  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
  };
  
  const handlePlantUpdate = (updatedPlant: Plant) => {
    updatePlant(updatedPlant);
  };
  
  const closeDialog = () => {
    setSelectedPlant(null);
  };
  
  // Organize plants by row
  const plantsByRow: Record<number, Plant[]> = {};
  
  space.plants.forEach(plant => {
    const row = plant.position.row;
    if (!plantsByRow[row]) {
      plantsByRow[row] = [];
    }
    plantsByRow[row].push(plant);
  });
  
  // Sort plants in each row by column
  Object.keys(plantsByRow).forEach(rowKey => {
    const row = Number(rowKey);
    plantsByRow[row] = plantsByRow[row].sort((a, b) => a.position.column - b.position.column);
  });
  
  return (
    <div className="space-y-4">
      {Object.entries(plantsByRow)
        .sort(([rowA], [rowB]) => Number(rowA) - Number(rowB))
        .map(([row, plants]) => (
          <div key={row} className="space-y-2">
            <h3 className="text-sm font-medium">Ligne {row}</h3>
            <div className="flex flex-wrap gap-1">
              {plants.map(plant => (
                <PlantCell 
                  key={plant.id} 
                  plant={plant} 
                  onClick={handlePlantClick} 
                />
              ))}
            </div>
          </div>
        ))
      }
      
      <Dialog open={!!selectedPlant} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de la plante</DialogTitle>
          </DialogHeader>
          {selectedPlant && (
            <PlantDetails 
              plant={selectedPlant} 
              onUpdate={handlePlantUpdate} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantGrid;
