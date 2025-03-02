
import { useState } from "react";
import { CultivationSpace, Plant } from "@/types";
import { useCultivation } from "@/context/CultivationContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import PlantDetails from "@/components/PlantDetails";
import { cn } from "@/lib/utils";

const stateLabels = {
  germination: "Germination",
  growth: "Croissance",
  flowering: "Floraison",
  drying: "Séchage",
  harvested: "Récolté"
};

const stateColors = {
  germination: "bg-purple-100 text-purple-800 border-purple-200",
  growth: "bg-blue-100 text-blue-800 border-blue-200",
  flowering: "bg-pink-100 text-pink-800 border-pink-200",
  drying: "bg-orange-100 text-orange-800 border-orange-200",
  harvested: "bg-green-100 text-green-800 border-green-200"
};

type PlantsListProps = {
  space: CultivationSpace;
};

const PlantsList = ({ space }: PlantsListProps) => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
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
  
  // Get unique rows from plants
  const rows = [...new Set(space.plants.map(plant => plant.position.row))].sort((a, b) => a - b);
  
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
  
  // Group plants by row
  const plantsByRow = rows.reduce((acc, row) => {
    acc[row] = space.plants
      .filter(plant => plant.position.row === row)
      .sort((a, b) => a.position.column - b.position.column);
    return acc;
  }, {} as Record<number, Plant[]>);
  
  return (
    <div>
      {rows.map(row => (
        <div key={row} className="mb-4 border rounded-md overflow-hidden">
          <div 
            className="bg-gray-100 p-3 flex justify-between items-center cursor-pointer"
            onClick={() => toggleRow(row)}
          >
            <h3 className="font-medium">Ligne {row}</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isRowExpanded(row) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          
          {isRowExpanded(row) && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Variété</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead>EC</TableHead>
                  <TableHead>pH</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plantsByRow[row].map(plant => (
                  <TableRow key={plant.id} className="hover:bg-muted/30">
                    <TableCell>L{plant.position.row} - C{plant.position.column}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: plant.variety.color }} 
                        />
                        <span>{plant.variety.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(stateColors[plant.state])}>
                        {stateLabels[plant.state]}
                      </Badge>
                    </TableCell>
                    <TableCell>{plant.ec.toFixed(2)}</TableCell>
                    <TableCell>{plant.ph.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handlePlantClick(plant)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
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
