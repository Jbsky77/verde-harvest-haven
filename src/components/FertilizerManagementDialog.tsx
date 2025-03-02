
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useCultivation } from "@/context/CultivationContext";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fertilizer, FertilizerType } from "@/types";

const FertilizerTypeLabels: Record<FertilizerType, string> = {
  base: "Base",
  growth: "Croissance",
  bloom: "Floraison",
  booster: "Booster",
  custom: "Personnalisé"
};

const DEFAULT_COLORS = [
  "#9b87f5", // Violet clair
  "#7E69AB", // Violet
  "#6E59A5", // Violet foncé
  "#4CAF50", // Vert
  "#E5BE7F", // Jaune doux
  "#F5A962", // Orange doux
  "#6ECFF6", // Bleu clair
];

const FertilizerManagementDialog = () => {
  const { fertilizers, addFertilizer, updateFertilizer, deleteFertilizer } = useCultivation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFertilizer, setEditingFertilizer] = useState<Fertilizer | null>(null);
  
  const [name, setName] = useState("");
  const [type, setType] = useState<FertilizerType>("custom");
  const [unitType, setUnitType] = useState<"ml/L" | "g/L">("ml/L");
  const [recommendedDosage, setRecommendedDosage] = useState<string>("1.0");
  const [color, setColor] = useState<string>(DEFAULT_COLORS[0]);
  
  const openNewFertilizerDialog = () => {
    setEditingFertilizer(null);
    setName("");
    setType("custom");
    setUnitType("ml/L");
    setRecommendedDosage("1.0");
    setColor(DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]);
    setIsDialogOpen(true);
  };
  
  const openEditFertilizerDialog = (fertilizer: Fertilizer) => {
    setEditingFertilizer(fertilizer);
    setName(fertilizer.name);
    setType(fertilizer.type);
    setUnitType(fertilizer.unitType);
    setRecommendedDosage(fertilizer.recommendedDosage.toString());
    setColor(fertilizer.color || DEFAULT_COLORS[0]);
    setIsDialogOpen(true);
  };
  
  const handleSaveFertilizer = () => {
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour l'engrais",
        variant: "destructive",
      });
      return;
    }
    
    const dosage = parseFloat(recommendedDosage);
    if (isNaN(dosage) || dosage <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un dosage valide",
        variant: "destructive",
      });
      return;
    }
    
    if (editingFertilizer) {
      // Update existing fertilizer
      updateFertilizer({
        ...editingFertilizer,
        name,
        type,
        unitType,
        recommendedDosage: dosage,
        color,
      });
      
      toast({
        title: "Engrais mis à jour",
        description: `L'engrais "${name}" a été mis à jour avec succès`,
        variant: "success",
      });
    } else {
      // Add new fertilizer
      addFertilizer({
        name,
        type,
        unitType,
        recommendedDosage: dosage,
        color,
      });
      
      toast({
        title: "Engrais ajouté",
        description: `L'engrais "${name}" a été ajouté avec succès`,
        variant: "success",
      });
    }
    
    setIsDialogOpen(false);
  };
  
  const handleDeleteFertilizer = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'engrais "${name}" ?`)) {
      deleteFertilizer(id);
      
      toast({
        title: "Engrais supprimé",
        description: `L'engrais "${name}" a été supprimé avec succès`,
        variant: "default",
      });
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Gestion des engrais</h2>
        <Button onClick={openNewFertilizerDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvel engrais
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Couleur</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fertilizers.map((fertilizer) => (
            <TableRow key={fertilizer.id}>
              <TableCell>
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: fertilizer.color || '#9b87f5' }} 
                />
              </TableCell>
              <TableCell>{fertilizer.name}</TableCell>
              <TableCell>{FertilizerTypeLabels[fertilizer.type]}</TableCell>
              <TableCell>{fertilizer.recommendedDosage.toFixed(1)} {fertilizer.unitType}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => openEditFertilizerDialog(fertilizer)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteFertilizer(fertilizer.id, fertilizer.name)}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingFertilizer ? "Modifier l'engrais" : "Nouvel engrais"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'engrais</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="ex: Stimulateur racinaire"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type d'engrais</Label>
              <Select 
                value={type} 
                onValueChange={(value) => setType(value as FertilizerType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="growth">Croissance</SelectItem>
                  <SelectItem value="bloom">Floraison</SelectItem>
                  <SelectItem value="booster">Booster</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage recommandé</Label>
                <Input 
                  id="dosage" 
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={recommendedDosage}
                  onChange={e => setRecommendedDosage(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unité</Label>
                <Select 
                  value={unitType} 
                  onValueChange={(value) => setUnitType(value as "ml/L" | "g/L")}
                >
                  <SelectTrigger id="unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml/L">ml/L</SelectItem>
                    <SelectItem value="g/L">g/L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full border border-gray-200" 
                  style={{ backgroundColor: color }} 
                />
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
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
            <Button onClick={handleSaveFertilizer}>
              {editingFertilizer ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FertilizerManagementDialog;
