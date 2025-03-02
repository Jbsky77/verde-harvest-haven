
import React, { useState } from "react";
import { useCultivation } from "@/context/CultivationContext";
import { PlantVariety } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VarietyManagementTab = () => {
  const { varieties, addVariety, updateVariety, deleteVariety } = useCultivation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariety, setEditingVariety] = useState<PlantVariety | null>(null);
  const [newVarietyName, setNewVarietyName] = useState("");
  const [newVarietyColor, setNewVarietyColor] = useState("#9b87f5");
  const [newVarietyGerminationTime, setNewVarietyGerminationTime] = useState<number | undefined>(undefined);
  const [newVarietyGrowthTime, setNewVarietyGrowthTime] = useState<number | undefined>(undefined);
  const [newVarietyFloweringTime, setNewVarietyFloweringTime] = useState<number | undefined>(undefined);
  const { toast } = useToast();

  const openCreateDialog = () => {
    setEditingVariety(null);
    setNewVarietyName("");
    setNewVarietyColor("#9b87f5");
    setNewVarietyGerminationTime(undefined);
    setNewVarietyGrowthTime(undefined);
    setNewVarietyFloweringTime(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (variety: PlantVariety) => {
    setEditingVariety(variety);
    setNewVarietyName(variety.name);
    setNewVarietyColor(variety.color);
    setNewVarietyGerminationTime(variety.germinationTime);
    setNewVarietyGrowthTime(variety.growthTime);
    setNewVarietyFloweringTime(variety.floweringTime);
    setIsDialogOpen(true);
  };

  const handleSaveVariety = () => {
    if (!newVarietyName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour la variété",
        variant: "destructive",
      });
      return;
    }

    if (editingVariety) {
      updateVariety({
        ...editingVariety,
        name: newVarietyName,
        color: newVarietyColor,
        germinationTime: newVarietyGerminationTime,
        growthTime: newVarietyGrowthTime,
        floweringTime: newVarietyFloweringTime,
      });

      toast({
        title: "Variété mise à jour",
        description: `La variété "${newVarietyName}" a été mise à jour`,
      });
    } else {
      addVariety({
        name: newVarietyName,
        color: newVarietyColor,
        germinationTime: newVarietyGerminationTime,
        growthTime: newVarietyGrowthTime,
        floweringTime: newVarietyFloweringTime,
      });

      toast({
        title: "Variété créée",
        description: `La nouvelle variété "${newVarietyName}" a été créée`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteVariety = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la variété "${name}" ?`)) {
      deleteVariety(id);

      toast({
        title: "Variété supprimée",
        description: `La variété "${name}" a été supprimée avec succès`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Liste des variétés</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle variété
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Couleur</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead className="text-right">Germination (jours)</TableHead>
            <TableHead className="text-right">Croissance (jours)</TableHead>
            <TableHead className="text-right">Floraison (jours)</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {varieties.map((variety) => (
            <TableRow key={variety.id}>
              <TableCell>
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: variety.color }} 
                />
              </TableCell>
              <TableCell>{variety.name}</TableCell>
              <TableCell className="text-right">{variety.germinationTime || "-"}</TableCell>
              <TableCell className="text-right">{variety.growthTime || "-"}</TableCell>
              <TableCell className="text-right">{variety.floweringTime || "-"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => openEditDialog(variety)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteVariety(variety.id, variety.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVariety ? `Modifier ${editingVariety.name}` : "Nouvelle variété"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={newVarietyName}
                onChange={(e) => setNewVarietyName(e.target.value)}
                placeholder="Nom de la variété"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full border border-gray-200" 
                  style={{ backgroundColor: newVarietyColor }} 
                />
                <Input
                  id="color"
                  type="color"
                  value={newVarietyColor}
                  onChange={(e) => setNewVarietyColor(e.target.value)}
                  className="w-20 h-10 p-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="germinationTime">Temps de germination (jours)</Label>
              <Input
                id="germinationTime"
                type="number"
                min="1"
                value={newVarietyGerminationTime || ""}
                onChange={(e) => setNewVarietyGerminationTime(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="growthTime">Temps de croissance (jours)</Label>
              <Input
                id="growthTime"
                type="number"
                min="1"
                value={newVarietyGrowthTime || ""}
                onChange={(e) => setNewVarietyGrowthTime(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="floweringTime">Temps de floraison (jours)</Label>
              <Input
                id="floweringTime"
                type="number"
                min="1"
                value={newVarietyFloweringTime || ""}
                onChange={(e) => setNewVarietyFloweringTime(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 60"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSaveVariety}>
              {editingVariety ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VarietyManagementTab;
