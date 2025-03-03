
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { PlantVariety } from "@/types";

interface VarietySelectorProps {
  selectedVarieties: string[];
  setSelectedVarieties: React.Dispatch<React.SetStateAction<string[]>>;
  varieties: PlantVariety[];
}

export const VarietySelector = ({
  selectedVarieties,
  setSelectedVarieties,
  varieties
}: VarietySelectorProps) => {
  const handleCheckVariety = (varietyId: string, checked: boolean) => {
    if (checked) {
      setSelectedVarieties(prev => [...prev, varietyId]);
    } else {
      setSelectedVarieties(prev => prev.filter(id => id !== varietyId));
    }
  };

  const selectAllVarieties = () => {
    setSelectedVarieties(varieties.map(v => v.id));
  };

  const deselectAllVarieties = () => {
    setSelectedVarieties([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Sélectionner les variétés</Label>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={selectAllVarieties}
            className="h-8 text-xs"
          >
            <Check className="mr-1 h-3 w-3" />
            Tout sélectionner
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={deselectAllVarieties}
            className="h-8 text-xs"
          >
            <X className="mr-1 h-3 w-3" />
            Tout désélectionner
          </Button>
        </div>
      </div>
      <ScrollArea className="h-44 border rounded-md p-2">
        <div className="space-y-2">
          {varieties.map((variety) => (
            <div key={variety.id} className="flex items-center gap-2">
              <Checkbox 
                id={`variety-${variety.id}`}
                checked={selectedVarieties.includes(variety.id)}
                onCheckedChange={(checked) => handleCheckVariety(variety.id, checked === true)}
              />
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: variety.color }}
              />
              <Label 
                htmlFor={`variety-${variety.id}`} 
                className="flex-grow cursor-pointer text-sm"
              >
                {variety.name}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
      <p className="text-sm text-muted-foreground mt-1">
        {selectedVarieties.length} variété(s) sélectionnée(s) sur {varieties.length}
      </p>
    </div>
  );
};
