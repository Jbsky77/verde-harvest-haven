
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCultivation } from "@/context/CultivationContext";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Fertilizer } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Trash, Edit, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Fertilizers = () => {
  const { fertilizers, addFertilizer, updateFertilizer, deleteFertilizer } = useCultivation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFertilizer, setSelectedFertilizer] = useState<Fertilizer | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("nutrient");
  const [unitType, setUnitType] = useState("ml");
  const [recommendedDosage, setRecommendedDosage] = useState("1.00");
  const [color, setColor] = useState("#3B82F6");
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleOpenAddDialog = () => {
    setIsEditMode(false);
    setSelectedFertilizer(null);
    setName("");
    setType("nutrient");
    setUnitType("ml");
    setRecommendedDosage("1.00");
    setColor("#3B82F6");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (fertilizer: Fertilizer) => {
    setIsEditMode(true);
    setSelectedFertilizer(fertilizer);
    setName(fertilizer.name);
    setType(fertilizer.type);
    setUnitType(fertilizer.unitType);
    setRecommendedDosage(fertilizer.recommendedDosage.toFixed(2));
    setColor(fertilizer.color);
    setIsDialogOpen(true);
  };

  const handleSaveFertilizer = () => {
    const dosage = parseFloat(recommendedDosage);
    
    if (name.trim() === "" || isNaN(dosage)) {
      toast({
        title: t('common.error'),
        description: t('fertilizers.invalidFormData'),
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditMode && selectedFertilizer) {
        updateFertilizer({
          ...selectedFertilizer,
          name,
          type,
          unitType,
          recommendedDosage: dosage,
          color
        });
        
        toast({
          title: t('common.success'),
          description: t('fertilizers.updateSuccess'),
        });
      } else {
        addFertilizer({
          name,
          type,
          unitType,
          recommendedDosage: dosage,
          color
        });
        
        toast({
          title: t('common.success'),
          description: t('fertilizers.addSuccess'),
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: String(error),
        variant: "destructive"
      });
    }
  };

  const handleDeleteFertilizer = (id: string) => {
    deleteFertilizer(id);
    toast({
      title: t('common.success'),
      description: t('fertilizers.deleteSuccess'),
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('fertilizers.title')}</h1>
          <p className="text-muted-foreground">{t('fertilizers.subtitle')}</p>
        </div>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          {t('fertilizers.addNew')}
        </Button>
      </div>
      
      <Separator className="my-6" />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('fertilizers.color')}</TableHead>
              <TableHead>{t('fertilizers.name')}</TableHead>
              <TableHead>{t('fertilizers.type')}</TableHead>
              <TableHead>{t('fertilizers.dosage')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fertilizers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {t('fertilizers.noFertilizers')}
                </TableCell>
              </TableRow>
            ) : (
              fertilizers.map((fertilizer) => (
                <TableRow key={fertilizer.id}>
                  <TableCell>
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: fertilizer.color }} 
                    />
                  </TableCell>
                  <TableCell className="font-medium">{fertilizer.name}</TableCell>
                  <TableCell>{t(`fertilizers.types.${fertilizer.type}`)}</TableCell>
                  <TableCell>
                    {fertilizer.recommendedDosage.toFixed(2)} {fertilizer.unitType}/L
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenEditDialog(fertilizer)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">{t('common.edit')}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteFertilizer(fertilizer.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">{t('common.delete')}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? t('fertilizers.editFertilizer') : t('fertilizers.addFertilizer')}
            </DialogTitle>
            <DialogDescription>
              {t('fertilizers.formDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('fertilizers.name')}
              </Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                {t('fertilizers.type')}
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('fertilizers.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nutrient">{t('fertilizers.types.nutrient')}</SelectItem>
                  <SelectItem value="supplement">{t('fertilizers.types.supplement')}</SelectItem>
                  <SelectItem value="stimulant">{t('fertilizers.types.stimulant')}</SelectItem>
                  <SelectItem value="ph">{t('fertilizers.types.ph')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">
                {t('fertilizers.dosage')}
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input 
                  id="dosage" 
                  type="number" 
                  step="0.01"
                  min="0" 
                  value={recommendedDosage} 
                  onChange={(e) => setRecommendedDosage(e.target.value)}
                  className="flex-1" 
                />
                <Select value={unitType} onValueChange={setUnitType}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml/L</SelectItem>
                    <SelectItem value="g">g/L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                {t('fertilizers.color')}
              </Label>
              <div className="col-span-3">
                <input 
                  type="color" 
                  id="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)} 
                  className="w-full h-10" 
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveFertilizer}>
              {isEditMode ? t('common.save') : t('common.add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fertilizers;
