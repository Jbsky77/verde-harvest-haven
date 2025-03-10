import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlantVariety } from "@/types";
import { VarietyCount } from "@/services/sessions/types";

interface VarietyCountInputProps {
  selectedVarieties: string[];
  varieties: PlantVariety[];
  varietyCounts: VarietyCount[];
  setVarietyCounts: React.Dispatch<React.SetStateAction<VarietyCount[]>>;
}

export const VarietyCountInput = ({
  selectedVarieties,
  varieties,
  varietyCounts,
  setVarietyCounts
}: VarietyCountInputProps) => {
  // Initialize or update variety counts when selected varieties change
  useEffect(() => {
    // Keep only varietyCounts that are still in selectedVarieties
    const filteredCounts = varietyCounts.filter(vc => 
      selectedVarieties.includes(vc.varietyId)
    );
    
    // Add new entries for newly selected varieties
    const newVarieties = selectedVarieties.filter(id => 
      !varietyCounts.some(vc => vc.varietyId === id)
    );
    
    const newCounts = [
      ...filteredCounts,
      ...newVarieties.map(id => ({ varietyId: id, count: 0 }))
    ];
    
    setVarietyCounts(newCounts);
  }, [selectedVarieties]);

  const handleCountChange = (varietyId: string, countValue: string) => {
    const count = parseInt(countValue) || 0;
    setVarietyCounts(prev => 
      prev.map(vc => 
        vc.varietyId === varietyId ? { ...vc, count: Math.max(0, count) } : vc
      )
    );
  };

  const getVarietyById = (id: string) => {
    return varieties.find(v => v.id === id);
  };

  const totalPlants = varietyCounts.reduce((sum, vc) => sum + vc.count, 0);

  if (selectedVarieties.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Label>Nombre de plants par variété</Label>
        <span className="text-sm text-muted-foreground">
          Total: {totalPlants} plants
        </span>
      </div>
      
      <Card className="p-3">
        <ScrollArea className="h-44 pr-2">
          <div className="space-y-3">
            {varietyCounts.map(({ varietyId, count }) => {
              const variety = getVarietyById(varietyId);
              if (!variety) return null;
              
              return (
                <div key={varietyId} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: variety.color }}
                  />
                  <span className="text-sm flex-grow">{variety.name}</span>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) => handleCountChange(varietyId, e.target.value)}
                      className="h-8 text-center"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
