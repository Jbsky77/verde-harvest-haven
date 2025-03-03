
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CultivationSession, PlantVariety } from "@/types";

interface SessionVarietyListProps {
  currentSession: CultivationSession;
  varieties: PlantVariety[];
  getEstimatedHarvestDateForVariety: (varietyId: string) => Date | null;
  getMaxHarvestDateForSession: (session: CultivationSession) => Date | null;
  formatDateToLocale: (date: Date | null) => string;
}

export const SessionVarietyList = ({
  currentSession,
  varieties,
  getEstimatedHarvestDateForVariety,
  getMaxHarvestDateForSession,
  formatDateToLocale
}: SessionVarietyListProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (!currentSession.selectedVarieties || currentSession.selectedVarieties.length === 0) {
    return <p className="text-sm text-green-800">Aucune variété sélectionnée pour cette session.</p>;
  }
  
  return (
    <>
      <div className={`flex items-center ${isMobile ? 'flex-col items-start' : 'justify-between'}`}>
        <span className="text-sm font-medium text-green-800">Variétés cultivées</span>
        {!isMobile && <span className="text-sm text-green-800">Date de récolte estimée</span>}
      </div>
      <div className="space-y-2">
        {currentSession.selectedVarieties.map(varietyId => {
          const variety = varieties.find(v => v.id === varietyId);
          if (!variety) return null;

          const harvestDate = getEstimatedHarvestDateForVariety(varietyId);
          
          return (
            <div key={varietyId} className={`flex ${isMobile ? 'flex-col gap-1' : 'items-center justify-between'}`}>
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
      <div className={`pt-2 border-t border-green-200 flex ${isMobile ? 'flex-col gap-1' : 'justify-between items-center'}`}>
        <div className="flex items-center gap-1 text-green-800">
          <InfoIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Fin de récolte estimée</span>
        </div>
        <Badge className="bg-green-700">
          {formatDateToLocale(getMaxHarvestDateForSession(currentSession))}
        </Badge>
      </div>
    </>
  );
};
