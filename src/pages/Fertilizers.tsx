
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash, Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCultivation } from "@/context/cultivationContext";
import { Fertilizer, FertilizerType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SideNavigation from "@/components/SideNavigation";

const Fertilizers = () => {
  const { t } = useTranslation();
  const { fertilizers, addFertilizer, updateFertilizer, deleteFertilizer } = useCultivation();
  const [activeTab, setActiveTab] = useState("list");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFertilizer, setSelectedFertilizer] = useState<Fertilizer | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState<FertilizerType>("base");
  const [unitType, setUnitType] = useState<"ml/L" | "g/L">("ml/L");
  const [dosage, setDosage] = useState("");
  const [color, setColor] = useState("#3b82f6");
  
  const resetForm = () => {
    setName("");
    setType("base");
    setUnitType("ml/L");
    setDosage("");
    setColor("#3b82f6");
    setIsEditing(false);
    setSelectedFertilizer(null);
  };
  
  const handleEditFertilizer = (fertilizer: Fertilizer) => {
    setSelectedFertilizer(fertilizer);
    setName(fertilizer.name);
    setType(fertilizer.type);
    setUnitType(fertilizer.unitType);
    setDosage(fertilizer.recommendedDosage.toString());
    setColor(fertilizer.color || "#3b82f6");
    setIsEditing(true);
    setActiveTab("add");
  };
  
  const handleDeleteClick = (fertilizer: Fertilizer) => {
    setSelectedFertilizer(fertilizer);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedFertilizer) {
      deleteFertilizer(selectedFertilizer.id);
      toast.success(t('fertilizers.deleteSuccess', { name: selectedFertilizer.name }));
      setIsDeleteDialogOpen(false);
      setSelectedFertilizer(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error(t('fertilizers.nameRequired'));
      return;
    }
    
    if (!dosage || isNaN(parseFloat(dosage))) {
      toast.error(t('fertilizers.dosageRequired'));
      return;
    }
    
    const fertilizerData = {
      name,
      type,
      unitType,
      recommendedDosage: parseFloat(parseFloat(dosage).toFixed(2)),
      color
    };
    
    if (isEditing && selectedFertilizer) {
      updateFertilizer({
        ...selectedFertilizer,
        ...fertilizerData
      });
      toast.success(t('fertilizers.updateSuccess', { name }));
    } else {
      addFertilizer(fertilizerData);
      toast.success(t('fertilizers.addSuccess', { name }));
    }
    
    resetForm();
    setActiveTab("list");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SideNavigation />
      
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{t('fertilizers.title')}</h1>
          <Button onClick={() => { resetForm(); setActiveTab(activeTab === "list" ? "add" : "list"); }}>
            {activeTab === "list" ? (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('fertilizers.addFertilizer')}
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                {t('common.cancel')}
              </>
            )}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">{t('fertilizers.list')}</TabsTrigger>
            <TabsTrigger value="add">{isEditing ? t('fertilizers.editFertilizer') : t('fertilizers.addFertilizer')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('fertilizers.list')}</CardTitle>
                <CardDescription>{t('fertilizers.listDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">{t('fertilizers.color')}</TableHead>
                      <TableHead>{t('fertilizers.name')}</TableHead>
                      <TableHead>{t('fertilizers.type')}</TableHead>
                      <TableHead>{t('fertilizers.dosage')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fertilizers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          {t('fertilizers.noFertilizers')}
                        </TableCell>
                      </TableRow>
                    )}
                    {fertilizers.map((fertilizer) => (
                      <TableRow key={fertilizer.id}>
                        <TableCell>
                          <div 
                            className="w-5 h-5 rounded-full" 
                            style={{ backgroundColor: fertilizer.color || '#3b82f6' }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{fertilizer.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {t(`fertilizers.types.${fertilizer.type}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {`${fertilizer.recommendedDosage.toFixed(2)} ${fertilizer.unitType}`}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleEditFertilizer(fertilizer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleDeleteClick(fertilizer)}
                              className="text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? t('fertilizers.editFertilizer') : t('fertilizers.addFertilizer')}
                </CardTitle>
                <CardDescription>
                  {isEditing 
                    ? t('fertilizers.editDescription') 
                    : t('fertilizers.addDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('fertilizers.name')}</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder={t('fertilizers.namePlaceholder')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">{t('fertilizers.type')}</Label>
                      <Select value={type} onValueChange={(value) => setType(value as FertilizerType)}>
                        <SelectTrigger id="type">
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
                      <Label htmlFor="unitType">{t('fertilizers.unit')}</Label>
                      <Select value={unitType} onValueChange={(value) => setUnitType(value as "ml/L" | "g/L")}>
                        <SelectTrigger id="unitType">
                          <SelectValue placeholder={t('fertilizers.selectUnit')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ml/L">{t('fertilizers.units.ml')}</SelectItem>
                          <SelectItem value="g/L">{t('fertilizers.units.g')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dosage">{t('fertilizers.dosage')}</Label>
                      <Input 
                        id="dosage" 
                        value={dosage} 
                        onChange={(e) => setDosage(e.target.value)} 
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="color">{t('fertilizers.color')}</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="color" 
                          type="color" 
                          value={color} 
                          onChange={(e) => setColor(e.target.value)} 
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          value={color} 
                          onChange={(e) => setColor(e.target.value)} 
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit">
                      <Check className="mr-2 h-4 w-4" />
                      {isEditing ? t('common.update') : t('common.add')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('fertilizers.confirmDelete')}</DialogTitle>
            <DialogDescription>
              {t('fertilizers.confirmDeleteDescription', { name: selectedFertilizer?.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fertilizers;
