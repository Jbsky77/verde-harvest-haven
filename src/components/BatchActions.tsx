
import { useCultivation } from "@/context/CultivationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { CultivationSpace, PlantState } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { PlusCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";

interface BatchActionsProps {
  space: CultivationSpace;
}

const BatchActions = ({ space }: BatchActionsProps) => {
  const { t } = useTranslation();
  const { 
    selectedSpaceId, 
    updatePlantsInSpace, 
    updatePlantsInRow, 
    addAlert,
    setSelectedPlantIds,
    selectedPlantIds,
    updatePlantsBatchState,
    updatePlantBatch,
    varieties,
    deleteRow,
    addRow
  } = useCultivation();
  
  const [selectedRow, setSelectedRow] = useState<number>(1);
  const [ec, setEc] = useState<number>(1.2);
  const [ph, setPh] = useState<number>(6.0);
  const [state, setState] = useState<PlantState>("germination");
  const [varietyId, setVarietyId] = useState<string>("");
  const [rowVarietyId, setRowVarietyId] = useState<string>("");
  
  // New state for adding row
  const [newRowVarietyId, setNewRowVarietyId] = useState<string>("");
  const [showAddRowDialog, setShowAddRowDialog] = useState(false);
  const [showDeleteRowDialog, setShowDeleteRowDialog] = useState(false);
  
  // Update selected row when space changes to make sure it's valid
  useEffect(() => {
    if (space && space.rows > 0) {
      setSelectedRow(1);
    }
  }, [space]);
  
  // Reset form values when space changes
  useEffect(() => {
    setEc(1.2);
    setPh(6.0);
    setState("germination");
    setVarietyId("");
    setRowVarietyId("");
    setNewRowVarietyId("");
  }, [selectedSpaceId]);
  
  if (!selectedSpaceId) return null;
  
  const stateOptions: { value: PlantState; label: string }[] = [
    { value: "germination", label: t('plantState.states.germination') },
    { value: "growth", label: t('plantState.states.growth') },
    { value: "flowering", label: t('plantState.states.flowering') },
    { value: "drying", label: t('plantState.states.drying') },
    { value: "harvested", label: t('plantState.states.harvested') }
  ];
  
  const handleApplyToSpace = () => {
    updatePlantsInSpace(selectedSpaceId, {
      ec,
      ph
    });
    
    addAlert({
      type: "success",
      message: t('plants.alerts.spaceUpdated', { spaceId: selectedSpaceId }),
      spaceId: selectedSpaceId
    });
    
    toast({
      title: t('common.updateApplied'),
      description: t('plants.alerts.spaceUpdated', { spaceId: selectedSpaceId }),
      variant: "success"
    });
  };
  
  const handleApplyToRow = () => {
    if (!selectedRow) return;
    
    const updates: Partial<any> = {
      ec,
      ph
    };
    
    // Add variety update if selected
    if (rowVarietyId) {
      const selectedVariety = varieties.find(v => v.id === rowVarietyId);
      if (selectedVariety) {
        updates.variety = selectedVariety;
      }
    }
    
    updatePlantsInRow(selectedSpaceId, selectedRow, updates);
    
    addAlert({
      type: "success",
      message: t('plants.alerts.rowUpdated', { row: selectedRow, spaceId: selectedSpaceId }),
      spaceId: selectedSpaceId
    });
    
    toast({
      title: t('common.updateApplied'),
      description: t('plants.alerts.rowUpdated', { row: selectedRow, spaceId: selectedSpaceId }),
      variant: "success"
    });
    
    // Reset variety selection after applying
    setRowVarietyId("");
  };
  
  const handleUpdateSelectedPlants = () => {
    if (selectedPlantIds.length === 0) {
      toast({
        title: t('plants.errors.noSelection'),
        description: t('plants.errors.selectPlants'),
        variant: "destructive"
      });
      return;
    }
    
    // Update plant state
    updatePlantsBatchState(selectedPlantIds, state);
    
    // Update plant variety if selected
    if (varietyId) {
      const selectedVariety = varieties.find(v => v.id === varietyId);
      if (selectedVariety) {
        const plantsToUpdate = space.plants
          .filter(plant => selectedPlantIds.includes(plant.id))
          .map(plant => ({
            ...plant,
            variety: selectedVariety
          }));
          
        updatePlantBatch(plantsToUpdate);
      }
    }
    
    addAlert({
      type: "success",
      message: t('plants.alerts.selectionUpdated', { count: selectedPlantIds.length }),
      spaceId: selectedSpaceId
    });
    
    toast({
      title: t('common.updateApplied'),
      description: t('plants.alerts.selectionUpdated', { count: selectedPlantIds.length }),
      variant: "success"
    });
    
    setSelectedPlantIds([]);
    setVarietyId("");
  };
  
  const handleDeleteRow = () => {
    if (!selectedRow) return;
    
    deleteRow(selectedSpaceId, selectedRow);
    
    addAlert({
      type: "success",
      message: t('plants.alerts.rowDeleted', { row: selectedRow, spaceId: selectedSpaceId }),
      spaceId: selectedSpaceId
    });
    
    toast({
      title: t('plants.rowDeleted'),
      description: t('plants.alerts.rowDeleted', { row: selectedRow, spaceId: selectedSpaceId }),
      variant: "success"
    });
    
    setShowDeleteRowDialog(false);
    
    // Select the first row if the current one was deleted
    if (space.rows > 0 && selectedRow > space.rows - 1) {
      setSelectedRow(1);
    }
  };
  
  const handleAddRow = () => {
    if (!newRowVarietyId) {
      toast({
        title: t('plants.errors.noVariety'),
        description: t('plants.errors.selectVariety'),
        variant: "destructive"
      });
      return;
    }
    
    const selectedVariety = varieties.find(v => v.id === newRowVarietyId);
    if (!selectedVariety) return;
    
    addRow(selectedSpaceId, selectedVariety);
    
    addAlert({
      type: "success",
      message: t('plants.alerts.rowAdded', { spaceId: selectedSpaceId }),
      spaceId: selectedSpaceId
    });
    
    toast({
      title: t('plants.rowAdded'),
      description: t('plants.alerts.rowAdded', { spaceId: selectedSpaceId }),
      variant: "success"
    });
    
    setShowAddRowDialog(false);
    setNewRowVarietyId("");
  };
  
  const rowOptions = Array.from({ length: space.rows }, (_, i) => i + 1);
  
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium mb-4">{t('plants.batchActions')}</h3>
      
      <Tabs defaultValue="space">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="space">{t('common.space')}</TabsTrigger>
          <TabsTrigger value="row">{t('plants.byRow')}</TabsTrigger>
          <TabsTrigger value="selected">{t('plants.selection')}</TabsTrigger>
        </TabsList>
        
        {/* Space tab content */}
        <TabsContent value="space" className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="space-ec">EC</Label>
              <span className="text-sm font-medium">{ec.toFixed(1)}</span>
            </div>
            <Slider
              id="space-ec"
              min={0.5}
              max={2.5}
              step={0.1}
              value={[ec]}
              onValueChange={(values) => setEc(values[0])}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="space-ph">pH</Label>
              <span className="text-sm font-medium">{ph.toFixed(1)}</span>
            </div>
            <Slider
              id="space-ph"
              min={5.0}
              max={7.0}
              step={0.1}
              value={[ph]}
              onValueChange={(values) => setPh(values[0])}
            />
          </div>
          
          <Button onClick={handleApplyToSpace} className="w-full">
            {t('plants.applyToSpace')}
          </Button>
        </TabsContent>
        
        {/* Row tab content */}
        <TabsContent value="row" className="space-y-4">
          <div>
            <Label htmlFor="row-select" className="mb-2 block">{t('plants.row')}</Label>
            <Select
              value={selectedRow.toString()}
              onValueChange={(value) => setSelectedRow(parseInt(value))}
            >
              <SelectTrigger id="row-select">
                <SelectValue placeholder={t('plants.selectRow')} />
              </SelectTrigger>
              <SelectContent>
                {rowOptions.map((row) => (
                  <SelectItem key={row} value={row.toString()}>
                    {t('plants.rowNumber', { number: row })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="row-variety" className="mb-2 block">{t('plants.variety')}</Label>
            <Select
              value={rowVarietyId}
              onValueChange={setRowVarietyId}
            >
              <SelectTrigger id="row-variety">
                <SelectValue placeholder={t('plants.selectVariety')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t('plants.keepCurrentVariety')}
                </SelectItem>
                {varieties.map(variety => (
                  <SelectItem 
                    key={variety.id} 
                    value={variety.id}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: variety.color }} 
                      />
                      <span>{variety.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="row-ec">EC</Label>
              <span className="text-sm font-medium">{ec.toFixed(1)}</span>
            </div>
            <Slider
              id="row-ec"
              min={0.5}
              max={2.5}
              step={0.1}
              value={[ec]}
              onValueChange={(values) => setEc(values[0])}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="row-ph">pH</Label>
              <span className="text-sm font-medium">{ph.toFixed(1)}</span>
            </div>
            <Slider
              id="row-ph"
              min={5.0}
              max={7.0}
              step={0.1}
              value={[ph]}
              onValueChange={(values) => setPh(values[0])}
            />
          </div>
          
          <Button onClick={handleApplyToRow} className="w-full mb-2">
            {t('plants.applyToRow', { row: selectedRow })}
          </Button>
          
          <div className="flex gap-2 mt-4">
            <Dialog open={showDeleteRowDialog} onOpenChange={setShowDeleteRowDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('plants.deleteRow')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('plants.confirmDeleteRow')}</DialogTitle>
                </DialogHeader>
                <p>{t('plants.deleteRowWarning', { row: selectedRow })}</p>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t('common.cancel')}</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={handleDeleteRow}>
                    {t('common.delete')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showAddRowDialog} onOpenChange={setShowAddRowDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t('plants.addRow')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('plants.addNewRow')}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="new-row-variety" className="mb-2 block">
                    {t('plants.selectVarietyForRow')}
                  </Label>
                  <Select
                    value={newRowVarietyId}
                    onValueChange={setNewRowVarietyId}
                  >
                    <SelectTrigger id="new-row-variety">
                      <SelectValue placeholder={t('plants.selectVariety')} />
                    </SelectTrigger>
                    <SelectContent>
                      {varieties.map(variety => (
                        <SelectItem 
                          key={variety.id} 
                          value={variety.id}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: variety.color }} 
                            />
                            <span>{variety.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">{t('common.cancel')}</Button>
                  </DialogClose>
                  <Button onClick={handleAddRow}>{t('common.add')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
        
        {/* Selected plants tab content */}
        <TabsContent value="selected" className="space-y-4">
          <div>
            <Label className="mb-2 block">
              {t('plants.selectedCount', { count: selectedPlantIds.length })}
            </Label>
          </div>
          
          <div>
            <Label htmlFor="selected-state" className="mb-2 block">{t('plants.state')}</Label>
            <Select
              value={state}
              onValueChange={(value: PlantState) => setState(value)}
            >
              <SelectTrigger id="selected-state">
                <SelectValue placeholder={t('plants.selectState')} />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map(option => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="selected-variety" className="mb-2 block">{t('plants.variety')}</Label>
            <Select
              value={varietyId}
              onValueChange={setVarietyId}
            >
              <SelectTrigger id="selected-variety">
                <SelectValue placeholder={t('plants.selectVariety')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t('plants.keepCurrentVariety')}
                </SelectItem>
                {varieties.map(variety => (
                  <SelectItem 
                    key={variety.id} 
                    value={variety.id}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: variety.color }} 
                      />
                      <span>{variety.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleUpdateSelectedPlants} 
            className="w-full"
            disabled={selectedPlantIds.length === 0}
          >
            {t('plants.applyToSelected')}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchActions;
