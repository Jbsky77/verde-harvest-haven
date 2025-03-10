
import { VarietyCount } from "@/services/sessions/types";
import { PlantVariety } from "@/types";
import { Badge } from "@/components/ui/badge";

interface VarietyCountDisplayProps {
  varietyCounts?: VarietyCount[];
  varieties: PlantVariety[];
}

export const VarietyCountDisplay = ({ varietyCounts, varieties }: VarietyCountDisplayProps) => {
  if (!varietyCounts || varietyCounts.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">Aucune plante spécifiée pour cette session.</p>
    );
  }

  const totalPlants = varietyCounts.reduce((sum, vc) => sum + vc.count, 0);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Plantes par variété</span>
        <Badge variant="outline">Total: {totalPlants} plantes</Badge>
      </div>
      <div className="space-y-2">
        {varietyCounts.map((vc) => {
          const variety = varieties.find(v => v.id === vc.varietyId);
          if (!variety) return null;
          
          return (
            <div key={vc.varietyId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: variety.color }}
                />
                <span className="text-sm">{variety.name}</span>
              </div>
              <Badge variant="outline">{vc.count} plantes</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};
