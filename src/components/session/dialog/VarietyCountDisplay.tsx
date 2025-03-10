
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
  
  // Calculer le poids sec total
  const totalDryWeight = varietyCounts.reduce((sum, vc) => {
    const variety = varieties.find(v => v.id === vc.varietyId);
    if (!variety || !variety.dryWeight) return sum;
    return sum + (variety.dryWeight * vc.count);
  }, 0);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Plantes par variété</span>
        <div className="flex gap-2">
          <Badge variant="outline">Total: {totalPlants} plantes</Badge>
          {totalDryWeight > 0 && (
            <Badge variant="outline" className="bg-green-50">
              Récolte estimée: {totalDryWeight.toFixed(1)} g
            </Badge>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {varietyCounts.map((vc) => {
          const variety = varieties.find(v => v.id === vc.varietyId);
          if (!variety) return null;
          
          const dryWeightTotal = variety.dryWeight ? (variety.dryWeight * vc.count).toFixed(1) : null;
          
          return (
            <div key={vc.varietyId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: variety.color }}
                />
                <span className="text-sm">{variety.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {dryWeightTotal && (
                  <span className="text-xs text-muted-foreground">
                    {dryWeightTotal} g
                  </span>
                )}
                <Badge variant="outline">{vc.count} plantes</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
