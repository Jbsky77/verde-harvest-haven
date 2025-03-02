
import { useState } from "react";
import { CultivationSpace, Plant } from "@/types";
import { useCultivation } from "@/context/CultivationContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Edit2, Leaf, Filter } from "lucide-react";
import PlantDetails from "@/components/PlantDetails";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Plantes de l'espace {space.name}
        </h2>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          Filtres
        </Button>
      </div>
      
      {rows.map(row => (
        <Card key={row} className="overflow-hidden animate-fade-in">
          <CardHeader 
            className={cn(
              "py-3 px-4 cursor-pointer transition-colors flex flex-row items-center justify-between",
              isRowExpanded(row) ? "bg-accent" : "hover:bg-muted/50"
            )}
            onClick={() => toggleRow(row)}
          >
            <CardTitle className="text-base font-medium flex items-center gap-2">
              Ligne {row}
              <Badge variant="outline" className="ml-2 bg-primary bg-opacity-10">
                {plantsByRow[row].length} plantes
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isRowExpanded(row) ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </CardHeader>
          
          {isRowExpanded(row) && (
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
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
                      <TableRow 
                        key={plant.id} 
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-mono text-xs">
                          L{plant.position.row} - C{plant.position.column}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: plant.variety.color }} 
                            />
                            <span className="font-medium">{plant.variety.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("transition-colors", stateColors[plant.state])}>
                            {stateLabels[plant.state]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{plant.ec.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">{plant.ph.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-primary/10 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlantClick(plant);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          )}
        </Card>
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
