
import { useState } from "react";
import { Plant, CultivationSpace } from "@/types";
import { useCultivation } from "@/context/CultivationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Leaf, Filter, Sprout, Flower } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlantDetails from "@/components/PlantDetails";
import PlantRow from "./PlantRow";
import SpaceNavigation from "./SpaceNavigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type PlantsListProps = {
  space: CultivationSpace;
};

const PlantsList = ({ space }: PlantsListProps) => {
  const { t } = useTranslation();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const { updatePlant, spaces, setSelectedSpaceId } = useCultivation();
  
  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
  };
  
  const handlePlantUpdate = (updatedPlant: Plant) => {
    updatePlant(updatedPlant);
    setSelectedPlant(null); // Close dialog after update
  };
  
  const closeDialog = () => {
    setSelectedPlant(null);
  };

  const navigateToSpace = (spaceId: number) => {
    setSelectedSpaceId(spaceId);
  };
  
  const toggleRow = (row: number) => {
    setExpandedRows(prev => 
      prev.includes(row) 
        ? prev.filter(r => r !== row) 
        : [...prev, row]
    );
  };
  
  const isRowExpanded = (row: number) => expandedRows.includes(row);
  
  const rows = [...new Set(space.plants.map(plant => plant.position.row))].sort((a, b) => a - b);
  
  const plantsByRow = rows.reduce((acc, row) => {
    acc[row] = space.plants
      .filter(plant => plant.position.row === row)
      .sort((a, b) => a.position.column - b.position.column);
    return acc;
  }, {} as Record<number, Plant[]>);
  
  const RoomIcon = space.roomType === "growth" ? Sprout : Flower;
  const roomLabel = space.roomType === "growth" ? t('space.growthRoom') : t('space.floweringRoom');
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <RoomIcon className={cn(
              "h-5 w-5",
              space.roomType === "growth" ? "text-green-600" : "text-purple-600"
            )} />
            {roomLabel} - {space.name}
          </h2>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            {t('space.filters')}
          </Button>
        </div>

        <SpaceNavigation 
          spaces={spaces} 
          currentSpace={space} 
          onNavigate={navigateToSpace} 
        />
      </div>
      
      {rows.map(row => (
        <PlantRow
          key={row}
          row={row}
          plants={plantsByRow[row]}
          isExpanded={isRowExpanded(row)}
          onToggle={() => toggleRow(row)}
          onPlantClick={handlePlantClick}
        />
      ))}
      
      <Dialog open={!!selectedPlant} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('plants.details')}</DialogTitle>
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
