
import { useState } from "react";
import { Plant, CultivationSpace } from "@/types";
import { useCultivation } from "@/context/CultivationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Leaf, Filter, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PlantDetails from "@/components/PlantDetails";
import PlantRow from "./PlantRow";
import SpaceNavigation from "./SpaceNavigation";
import VarietyBatchUpdateDialog from "./VarietyBatchUpdateDialog";
import { toast } from "sonner";

type PlantsListProps = {
  space: CultivationSpace;
};

const PlantsList = ({ space }: PlantsListProps) => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const { updatePlant, updatePlantsInSpace, updatePlantsInRow, varieties, spaces, setSelectedSpaceId } = useCultivation();
  
  // États pour les dialogues de modification par lot
  const [isSpaceUpdateDialogOpen, setIsSpaceUpdateDialogOpen] = useState(false);
  const [isRowUpdateDialogOpen, setIsRowUpdateDialogOpen] = useState(false);
  const [selectedRowForUpdate, setSelectedRowForUpdate] = useState<number | null>(null);
  
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
  
  // Ouvrir le dialogue pour mettre à jour la variété de tout l'espace
  const openSpaceUpdateDialog = () => {
    setIsSpaceUpdateDialogOpen(true);
  };
  
  // Ouvrir le dialogue pour mettre à jour la variété d'une ligne spécifique
  const openRowUpdateDialog = (row: number) => {
    setSelectedRowForUpdate(row);
    setIsRowUpdateDialogOpen(true);
  };
  
  // Mettre à jour les variétés de toutes les plantes dans l'espace
  const handleSpaceVarietyUpdate = (varietyId: string) => {
    const selectedVariety = varieties.find(v => v.id === varietyId);
    if (!selectedVariety) return;
    
    updatePlantsInSpace(space.id, { variety: selectedVariety });
    toast.success(`Variété mise à jour pour toutes les plantes de l'espace ${space.name}`);
  };
  
  // Mettre à jour les variétés de toutes les plantes dans une ligne
  const handleRowVarietyUpdate = (varietyId: string) => {
    if (selectedRowForUpdate === null) return;
    
    const selectedVariety = varieties.find(v => v.id === varietyId);
    if (!selectedVariety) return;
    
    updatePlantsInRow(space.id, selectedRowForUpdate, { variety: selectedVariety });
    toast.success(`Variété mise à jour pour toutes les plantes de la ligne ${selectedRowForUpdate}`);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Plantes de l'espace {space.name}
          </h2>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  Modifier en lot
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={openSpaceUpdateDialog}>
                  Changer variété - Tout l'espace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
          </div>
        </div>

        {/* Space navigation controls */}
        <SpaceNavigation 
          spaces={spaces} 
          currentSpace={space} 
          onNavigate={navigateToSpace} 
        />
      </div>
      
      {rows.map(row => (
        <div key={row}>
          <PlantRow
            row={row}
            plants={plantsByRow[row]}
            isExpanded={isRowExpanded(row)}
            onToggle={() => toggleRow(row)}
            onPlantClick={handlePlantClick}
          />
          {isRowExpanded(row) && (
            <div className="flex justify-end mt-2 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openRowUpdateDialog(row)}
                className="flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                Changer variété - Ligne {row}
              </Button>
            </div>
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

      {/* Dialogue pour mise à jour de variété par espace */}
      <VarietyBatchUpdateDialog
        isOpen={isSpaceUpdateDialogOpen}
        onClose={() => setIsSpaceUpdateDialogOpen(false)}
        onUpdate={handleSpaceVarietyUpdate}
        title="Changer la variété - Espace entier"
        description={`Cette action va modifier la variété de toutes les plantes dans l'espace ${space.name}.`}
      />

      {/* Dialogue pour mise à jour de variété par ligne */}
      <VarietyBatchUpdateDialog
        isOpen={isRowUpdateDialogOpen}
        onClose={() => setIsRowUpdateDialogOpen(false)}
        onUpdate={handleRowVarietyUpdate}
        title={`Changer la variété - Ligne ${selectedRowForUpdate}`}
        description={`Cette action va modifier la variété de toutes les plantes dans la ligne ${selectedRowForUpdate}.`}
      />
    </div>
  );
};

export default PlantsList;
