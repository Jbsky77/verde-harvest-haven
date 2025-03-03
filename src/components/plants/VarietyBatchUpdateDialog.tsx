
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlantVariety } from "@/types";
import { useCultivation } from "@/context/CultivationContext";
import { toast } from "sonner";

type VarietyBatchUpdateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (varietyId: string) => void;
  title: string;
  description: string;
};

const VarietyBatchUpdateDialog = ({
  isOpen,
  onClose,
  onUpdate,
  title,
  description
}: VarietyBatchUpdateDialogProps) => {
  const { varieties } = useCultivation();
  const [selectedVarietyId, setSelectedVarietyId] = useState<string>("");

  const handleUpdate = () => {
    if (!selectedVarietyId) {
      toast.error("Veuillez sélectionner une variété");
      return;
    }
    
    onUpdate(selectedVarietyId);
    onClose();
  };

  const resetAndClose = () => {
    setSelectedVarietyId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          
          <Select 
            value={selectedVarietyId}
            onValueChange={setSelectedVarietyId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une variété" />
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
          <Button variant="outline" onClick={resetAndClose}>Annuler</Button>
          <Button onClick={handleUpdate}>Appliquer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VarietyBatchUpdateDialog;
