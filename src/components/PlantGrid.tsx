
import { useState } from "react";
import { CultivationSpace, Plant, PlantState } from "@/types";
import { useCultivation } from "@/context/CultivationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Leaf, Filter, ArrowLeft, ArrowRight } from "lucide-react";
import PlantDetails from "@/components/PlantDetails";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        "w-5 h-5 border rounded-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/40",
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
  
  const allPlants = [...space.plants].sort((a, b) => {
    const aId = a.id.toString();
    const bId = b.id.toString();
    
    return aId.localeCompare(bId, undefined, { numeric: true });
  });
  const totalPlants = allPlants.length;
  
  // Diviser les plantes en 4 colonnes
  const plantsPerColumn = Math.ceil(totalPlants / 4);
  const column1 = allPlants.slice(0, plantsPerColumn);
  const column2 = allPlants.slice(plantsPerColumn, plantsPerColumn * 2);
  const column3 = allPlants.slice(plantsPerColumn * 2, plantsPerColumn * 3);
  const column4 = allPlants.slice(plantsPerColumn * 3);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Plantes de l'espace {space.name}
          </h2>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>

        <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={prevSpace}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Espace précédent
          </Button>
          
          <div className="flex gap-2">
            {spaces.map(s => (
              <Button
                key={s.id}
                variant={s.id === space.id ? "default" : "outline"}
                size="sm"
                onClick={() => navigateToSpace(s.id)}
                className="min-w-10"
              >
                {s.id}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={nextSpace}
            className="flex items-center gap-1"
          >
            Espace suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="py-3 px-4 bg-accent/30">
          <CardTitle className="text-base font-medium">Vue en grille ({totalPlants} plantes)</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-48 w-full">
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col gap-1">
                {column1.map(plant => (
                  <PlantCell 
                    key={plant.id} 
                    plant={plant} 
                    onClick={handlePlantClick} 
                  />
                ))}
              </div>
              <div className="flex flex-col gap-1">
                {column2.map(plant => (
                  <PlantCell 
                    key={plant.id} 
                    plant={plant} 
                    onClick={handlePlantClick} 
                  />
                ))}
              </div>
              <div className="flex flex-col gap-1">
                {column3.map(plant => (
                  <PlantCell 
                    key={plant.id} 
                    plant={plant} 
                    onClick={handlePlantClick} 
                  />
                ))}
              </div>
              <div className="flex flex-col gap-1">
                {column4.map(plant => (
                  <PlantCell 
                    key={plant.id} 
                    plant={plant} 
                    onClick={handlePlantClick} 
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
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
