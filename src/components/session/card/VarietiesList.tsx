
import { Badge } from "@/components/ui/badge";
import { CultivationSession } from "@/context/types";
import { PlantVariety } from "@/types";

interface VarietiesListProps {
  currentSession: CultivationSession;
  varieties: PlantVariety[];
  getEstimatedHarvestDateForVariety: (varietyId: string) => Date | null;
  formatDateToLocale: (date: Date | null) => string;
}

export const VarietiesList = ({ 
  currentSession, 
  varieties, 
  getEstimatedHarvestDateForVariety, 
  formatDateToLocale 
}: VarietiesListProps) => {
  if (!currentSession.selectedVarieties || currentSession.selectedVarieties.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-green-200">
        <span className="text-sm font-medium text-green-800">Variétés cultivées</span>
        <span className="text-sm text-green-800">Date de récolte estimée</span>
      </div>
      <div className="space-y-2">
        {currentSession.selectedVarieties.map(varietyId => {
          const variety = varieties.find(v => v.id === varietyId);
          if (!variety) return null;

          const harvestDate = getEstimatedHarvestDateForVariety(varietyId);
          
          return (
            <div key={varietyId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: variety.color }}
                />
                <span className="text-sm text-green-800">{variety.name}</span>
              </div>
              <Badge variant="outline" className="bg-white text-green-800">
                {formatDateToLocale(harvestDate)}
              </Badge>
            </div>
          );
        })}
      </div>
    </>
  );
};
