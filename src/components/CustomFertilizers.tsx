
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCultivation } from "@/context/CultivationContext";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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

const CustomFertilizers = () => {
  const { fertilizers, addFertilizer, updateFertilizer, deleteFertilizer } = useCultivation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFertilizer, setEditingFertilizer] = useState<Fertilizer | null>(null);
  
  const [name, setName] = useState("");
  const [type, setType] = useState<FertilizerType>("custom");
  const [unitType, setUnitType] = useState<"ml/L" | "g/L">("ml/L");
  const [recommendedDosage, setRecommendedDosage] = useState<string>("1.0");
  
  const customFertilizers = fertilizers.filter(f => f.isCustom);
  
  const openNewFertilizerDialog = () => {
    setEditingFertilizer(null);
    setName("");
    setType("custom");
    setUnitType("ml/L");
    setRecommendedDosage("1.0");
    setIsDialogOpen(true);
  };
  
  const openEditFertilizerDialog = (fertilizer: Fertilizer) => {
    setEditingFertilizer(fertilizer);
    setName(fertilizer.name);
    setType(fertilizer.type);
    setUnitType(fertilizer.unitType);
    setRecommendedDosage(fertilizer.recommendedDosage.toString());
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Engrais personnalisés</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={openNewFertilizerDialog}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Nouvel engrais
        </Button>
      </CardHeader>
      <CardContent>
        {customFertilizers.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Aucun engrais personnalisé. Ajoutez-en un pour commencer.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customFertilizers.map(fertilizer => (
                <TableRow key={fertilizer.id}>
                  <TableCell>{fertilizer.name}</TableCell>
                  <TableCell>{FertilizerTypeLabels[fertilizer.type]}</TableCell>
                  <TableCell>{fertilizer.recommendedDosage.toFixed(1)} {fertilizer.unitType}</TableCell>
                  <TableCell className="text-right space-x-1">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
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
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleSaveFertilizer}>
                {editingFertilizer ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CustomFertilizers;
