import { useState } from "react";
import { useCultivation } from "@/context/CultivationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FertilizerType, Fertilizer } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import SideNavigation from "@/components/SideNavigation";

const FertilizerPage = () => {
  const { fertilizers, addFertilizer, updateFertilizer, deleteFertilizer } = useCultivation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFertilizer, setCurrentFertilizer] = useState<Fertilizer | null>(null);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<FertilizerType>("base");
  const [newUnitType, setNewUnitType] = useState<"ml/L" | "g/L">("ml/L");
  const [newDosage, setNewDosage] = useState<number>(0);
  const [newColor, setNewColor] = useState("#00A3FF");
  const { t } = useTranslation();

  const resetForm = () => {
    setNewName("");
    setNewType("base");
    setNewUnitType("ml/L");
    setNewDosage(0);
    setNewColor("#00A3FF");
    setCurrentFertilizer(null);
    setIsEditing(false);
  };

  const openDialog = (fertilizer?: Fertilizer) => {
    resetForm();
    
    if (fertilizer) {
      setCurrentFertilizer(fertilizer);
      setNewName(fertilizer.name);
      setNewType(fertilizer.type);
      setNewUnitType(fertilizer.unitType);
      setNewDosage(fertilizer.recommendedDosage);
      setNewColor(fertilizer.color || "#00A3FF");
      setIsEditing(true);
    }
    
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!newName) {
      toast.error(t('fertilizers.nameRequired'));
      return;
    }

    try {
      const fertilizerData = {
        name: newName,
        type: newType,
        unitType: newUnitType,
        recommendedDosage: newDosage,
        color: newColor
      };

      if (isEditing && currentFertilizer) {
        updateFertilizer({
          ...currentFertilizer,
          ...fertilizerData
        });
        toast.success(t('fertilizers.updated', { name: newName }));
      } else {
        addFertilizer(fertilizerData);
        toast.success(t('fertilizers.created', { name: newName }));
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving fertilizer:", error);
      toast.error(t('fertilizers.error'));
    }
  };

  const handleDelete = (fertilizerId: string, name: string) => {
    if (confirm(t('fertilizers.confirmDelete', { name }))) {
      deleteFertilizer(fertilizerId);
      toast.success(t('fertilizers.deleted', { name }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SideNavigation />
      
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <Card className="shadow-md">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-primary">{t('common.fertilizers')}</CardTitle>
              <Button onClick={() => openDialog()} className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('fertilizers.add')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: "50px" }}></TableHead>
                  <TableHead>{t('fertilizers.name')}</TableHead>
                  <TableHead>{t('fertilizers.type')}</TableHead>
                  <TableHead>{t('fertilizers.unitType')}</TableHead>
                  <TableHead>{t('fertilizers.dosage')}</TableHead>
                  <TableHead style={{ width: "100px" }}>{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fertilizers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      {t('fertilizers.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  fertilizers.map((fertilizer) => (
                    <TableRow key={fertilizer.id}>
                      <TableCell>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: fertilizer.color || "#00A3FF" }} 
                        />
                      </TableCell>
                      <TableCell className="font-medium">{fertilizer.name}</TableCell>
                      <TableCell>{t(`fertilizers.types.${fertilizer.type}`)}</TableCell>
                      <TableCell>{fertilizer.unitType}</TableCell>
                      <TableCell>{fertilizer.recommendedDosage.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openDialog(fertilizer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(fertilizer.id, fertilizer.name)}
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
                  ? t('fertilizers.edit', { name: currentFertilizer?.name }) 
                  : t('fertilizers.create')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fertilizers.name')}</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t('fertilizers.namePlaceholder')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">{t('fertilizers.type')}</Label>
                <Select 
                  value={newType} 
                  onValueChange={(value: FertilizerType) => setNewType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('fertilizers.selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base">{t('fertilizers.types.base')}</SelectItem>
                    <SelectItem value="growth">{t('fertilizers.types.growth')}</SelectItem>
                    <SelectItem value="bloom">{t('fertilizers.types.bloom')}</SelectItem>
                    <SelectItem value="booster">{t('fertilizers.types.booster')}</SelectItem>
                    <SelectItem value="custom">{t('fertilizers.types.custom')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unitType">{t('fertilizers.unitType')}</Label>
                <Select 
                  value={newUnitType} 
                  onValueChange={(value: "ml/L" | "g/L") => setNewUnitType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('fertilizers.selectUnitType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml/L">ml/L</SelectItem>
                    <SelectItem value="g/L">g/L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dosage">{t('fertilizers.dosage')}</Label>
                <Input
                  id="dosage"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newDosage}
                  onChange={(e) => setNewDosage(parseFloat(e.target.value) || 0)}
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
    </div>
  );
};

export default FertilizerPage;
