
import { PlantVariety } from "@/types";

interface VarietyLegendProps {
  selectedVarieties?: string[];
  varieties: PlantVariety[];
}

export const VarietyLegend = ({ selectedVarieties, varieties }: VarietyLegendProps) => {
  if (!selectedVarieties || selectedVarieties.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-1 mb-3">
      {selectedVarieties.map((varietyId) => {
        const variety = varieties.find(v => v.id === varietyId);
        if (!variety) return null;
        return (
          <div key={varietyId} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: variety.color }}
            />
            <span className="text-xs text-green-800">{variety.name}</span>
          </div>
        );
      })}
    </div>
  );
};
