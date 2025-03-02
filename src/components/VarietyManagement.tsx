
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCultivation } from "@/context/CultivationContext";
import { toast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";
import { PlantVariety } from "@/types";

const VarietyManagement = () => {
  const { varieties, addVariety, updateVariety, deleteVariety } = useCultivation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariety, setEditingVariety] = useState<PlantVariety | null>(null);
  const [newVarietyName, setNewVarietyName] = useState("");
  const [newVarietyColor, setNewVarietyColor] = useState("#9b87f5");

  const openCreateDialog = () => {
    setEditingVariety(null);
    setNewVarietyName("");
    setNewVarietyColor("#9b87f5");
    setIsDialogOpen(true);
  };

  const openEditDialog = (variety: PlantVariety) => {
    setEditingVariety(variety);
    setNewVarietyName(variety.name);
    setNewVarietyColor(variety.color);
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
      // Update existing variety
      updateVariety({
        ...editingVariety,
        name: newVarietyName,
        color: newVarietyColor,
      });
      
      toast({
        title: "Variété mise à jour",
        description: `La variété "${newVarietyName}" a été mise à jour`,
        variant: "default",
      });
    } else {
      // Create new variety
      addVariety({
        name: newVarietyName,
        color: newVarietyColor,
      });
      
      toast({
        title: "Variété créée",
        description: `La nouvelle variété "${newVarietyName}" a été créée`,
        variant: "default",
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
        variant: "default",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Gestion des variétés</h2>
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
    </>
  );
};

export default VarietyManagement;
