
import { useState } from "react";
import { CultivationSpace, Plant } from "@/types";
import { useCultivation } from "@/context/CultivationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PlantDetails from "@/components/PlantDetails";
import PlantsHeader from "./PlantsHeader";
import SpaceNavigation from "./SpaceNavigation";
import PlantRowCard from "./PlantRowCard";

type PlantsListProps = {
  space: CultivationSpace;
};

const PlantsList = ({ space }: PlantsListProps) => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const { updatePlant, spaces, setSelectedSpaceId } = useCultivation();
  
  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
  };
  
  const handlePlantUpdate = (updatedPlant: Plant) => {
    updatePlant(updatedPlant);
  };
  
  const closeDialog = () => {
    setSelectedPlant(null);
  };

  const navigateToSpace = (spaceId: number) => {
    setSelectedSpaceId(spaceId);
  };

  const nextSpace = () => {
    const currentIndex = spaces.findIndex(s => s.id === space.id);
    const nextIndex = (currentIndex + 1) % spaces.length;
    navigateToSpace(spaces[nextIndex].id);
  };

  const prevSpace = () => {
    const currentIndex = spaces.findIndex(s => s.id === space.id);
    const prevIndex = (currentIndex - 1 + spaces.length) % spaces.length;
    navigateToSpace(spaces[prevIndex].id);
  };
  
  // Toggle row expansion
  const toggleRow = (row: number) => {
    setExpandedRows(prev => 
      prev.includes(row) 
        ? prev.filter(r => r !== row) 
        : [...prev, row]
    );
  };
  
  // Check if row is expanded
  const isRowExpanded = (row: number) => expandedRows.includes(row);
  
  // Get unique rows from plants
  const rows = [...new Set(space.plants.map(plant => plant.position.row))].sort((a, b) => a - b);
  
  // Group plants by row
  const plantsByRow = rows.reduce((acc, row) => {
    acc[row] = space.plants
      .filter(plant => plant.position.row === row)
      .sort((a, b) => a.position.column - b.position.column);
    return acc;
  }, {} as Record<number, Plant[]>);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <PlantsHeader spaceName={space.name} />

        {/* Space navigation controls */}
        <SpaceNavigation
          space={space}
          spaces={spaces}
          navigateToSpace={navigateToSpace}
          prevSpace={prevSpace}
          nextSpace={nextSpace}
        />
      </div>
      
      {rows.map(row => (
        <PlantRowCard
          key={row}
          row={row}
          plants={plantsByRow[row]}
          isExpanded={isRowExpanded(row)}
          toggleRow={toggleRow}
          onPlantClick={handlePlantClick}
        />
      ))}
      
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

export default PlantsList;
