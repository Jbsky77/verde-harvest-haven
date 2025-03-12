
import { useState } from "react";
import { useCultivation } from "@/context/CultivationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PlantVariety } from "@/types";
import { useTranslation } from "react-i18next";

const VarietiesPage = () => {
  const { varieties, addVariety, updateVariety, deleteVariety } = useCultivation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVariety, setCurrentVariety] = useState<PlantVariety | null>(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#9b87f5");
  const [newGerminationTime, setNewGerminationTime] = useState<number | undefined>(undefined);
  const [newGrowthTime, setNewGrowthTime] = useState<number | undefined>(undefined);
  const [newFloweringTime, setNewFloweringTime] = useState<number | undefined>(undefined);
  const [newDryWeight, setNewDryWeight] = useState<number | undefined>(undefined);
  const { t } = useTranslation();

  const resetForm = () => {
    setNewName("");
    setNewColor("#9b87f5");
    setNewGerminationTime(undefined);
    setNewGrowthTime(undefined);
    setNewFloweringTime(undefined);
    setNewDryWeight(undefined);
    setCurrentVariety(null);
    setIsEditing(false);
  };

  const openDialog = (variety?: PlantVariety) => {
    resetForm();
    
    if (variety) {
      setCurrentVariety(variety);
      setNewName(variety.name);
      setNewColor(variety.color);
      setNewGerminationTime(variety.germinationTime);
      setNewGrowthTime(variety.growthTime);
      setNewFloweringTime(variety.floweringTime);
      setNewDryWeight(variety.dryWeight);
      setIsEditing(true);
    }
    
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!newName.trim()) {
      toast.error(t('varieties.nameRequired'));
      return;
    }

    try {
      const varietyData = {
        name: newName,
        color: newColor,
        germinationTime: newGerminationTime,
        growthTime: newGrowthTime,
        floweringTime: newFloweringTime,
        dryWeight: newDryWeight
      };

      if (isEditing && currentVariety) {
        updateVariety({
          ...currentVariety,
          ...varietyData
        });
        toast.success(t('varieties.updated', { name: newName }));
      } else {
        addVariety(varietyData);
        toast.success(t('varieties.created', { name: newName }));
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving variety:", error);
      toast.error(t('varieties.error'));
    }
  };

  const handleDelete = (varietyId: string, name: string) => {
    if (confirm(t('varieties.confirmDelete', { name }))) {
      deleteVariety(varietyId);
      toast.success(t('varieties.deleted', { name }));
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <Card className="shadow-md">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary">{t('common.varieties')}</CardTitle>
            <Button onClick={() => openDialog()} className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('varieties.add')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: "50px" }}>{t('common.color')}</TableHead>
                <TableHead>{t('varieties.name')}</TableHead>
                <TableHead className="text-right">{t('varieties.germinationTime')}</TableHead>
                <TableHead className="text-right">{t('varieties.growthTime')}</TableHead>
                <TableHead className="text-right">{t('varieties.floweringTime')}</TableHead>
                <TableHead className="text-right">{t('varieties.dryWeight')}</TableHead>
                <TableHead style={{ width: "100px" }}>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {varieties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    {t('varieties.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                varieties.map((variety) => (
                  <TableRow key={variety.id}>
                    <TableCell>
                      <div 
                        className="w-6 h-6 rounded-full" 
                        style={{ backgroundColor: variety.color }} 
                      />
                    </TableCell>
                    <TableCell className="font-medium">{variety.name}</TableCell>
                    <TableCell className="text-right">{variety.germinationTime || "-"}</TableCell>
                    <TableCell className="text-right">{variety.growthTime || "-"}</TableCell>
                    <TableCell className="text-right">{variety.floweringTime || "-"}</TableCell>
                    <TableCell className="text-right">{variety.dryWeight ? `${variety.dryWeight} g` : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openDialog(variety)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(variety.id, variety.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing 
                ? t('varieties.edit', { name: currentVariety?.name }) 
                : t('varieties.create')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('varieties.name')}</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t('varieties.namePlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">{t('common.color')}</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full border border-gray-200" 
                  style={{ backgroundColor: newColor }} 
                />
                <Input
                  id="color"
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="germinationTime">{t('varieties.germinationTime')}</Label>
              <Input
                id="germinationTime"
                type="number"
                min="1"
                value={newGerminationTime || ""}
                onChange={(e) => setNewGerminationTime(e.target.value ? Number(e.target.value) : undefined)}
                placeholder={t('varieties.daysPlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="growthTime">{t('varieties.growthTime')}</Label>
              <Input
                id="growthTime"
                type="number"
                min="1"
                value={newGrowthTime || ""}
                onChange={(e) => setNewGrowthTime(e.target.value ? Number(e.target.value) : undefined)}
                placeholder={t('varieties.daysPlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="floweringTime">{t('varieties.floweringTime')}</Label>
              <Input
                id="floweringTime"
                type="number"
                min="1"
                value={newFloweringTime || ""}
                onChange={(e) => setNewFloweringTime(e.target.value ? Number(e.target.value) : undefined)}
                placeholder={t('varieties.daysPlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dryWeight">{t('varieties.dryWeight')}</Label>
              <Input
                id="dryWeight"
                type="number"
                min="1"
                value={newDryWeight || ""}
                onChange={(e) => setNewDryWeight(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="g par plant"
              />
              <p className="text-xs text-muted-foreground">
                Poids sec moyen en grammes par plant
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? t('common.update') : t('common.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VarietiesPage;
