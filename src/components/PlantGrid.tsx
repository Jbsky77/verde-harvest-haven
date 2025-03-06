import { useState } from "react";
import { CultivationSpace, Plant, PlantState } from "@/types";
import { useCultivation } from "@/context/CultivationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Leaf, Filter, ArrowLeft, ArrowRight, Sprout, Flower } from "lucide-react";
import PlantDetails from "@/components/PlantDetails";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const { 
    updatePlant, 
    getSpacesByRoomType, 
    setSelectedSpaceId,
    selectedRoomType
  } = useCultivation();
  
  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
  };
  
  const handlePlantUpdate = (updatedPlant: Plant) => {
    updatePlant(updatedPlant);
  };
  
  const closeDialog = () => {
    setSelectedPlant(null);
  };

  const spaces = getSpacesByRoomType(selectedRoomType);
  
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
  
  const RoomIcon = space.roomType === "growth" ? Sprout : Flower;
  const roomLabel = space.roomType === "growth" ? "Croissance" : "Floraison";
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <RoomIcon className={cn(
              "h-5 w-5",
              space.roomType === "growth" ? "text-green-600" : "text-purple-600"
            )} />
            Plantes de {roomLabel}
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
          <CardTitle className="text-base font-medium">Liste des plantes (Espace {space.id})</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ligne</TableHead>
                  <TableHead>Colonne</TableHead>
                  <TableHead>Variété</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead>EC</TableHead>
                  <TableHead>pH</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {space.plants.map((plant) => (
                  <TableRow key={plant.id}>
                    <TableCell>{plant.position.row}</TableCell>
                    <TableCell>{plant.position.column}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: plant.variety.color }}
                        />
                        {plant.variety.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        stateBackgroundColors[plant.state]
                      )}>
                        {plant.state}
                      </span>
                    </TableCell>
                    <TableCell>{plant.ec}</TableCell>
                    <TableCell>{plant.ph}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handlePlantClick(plant)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
