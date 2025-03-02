
import { useCultivation } from "@/context/CultivationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, CalendarIcon } from "lucide-react";

interface ActiveSessionCardProps {
  formatDateToLocale: (date: Date | null) => string;
}

const ActiveSessionCard = ({ formatDateToLocale }: ActiveSessionCardProps) => {
  const { 
    currentSession, 
    varieties, 
    getEstimatedHarvestDateForVariety,
    getMaxHarvestDateForSession
  } = useCultivation();

  if (!currentSession || !currentSession.isActive) {
    return null;
  }

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Session en cours: {currentSession.name}
        </CardTitle>
        <CardDescription className="text-green-700">
          Démarrée le {formatDateToLocale(new Date(currentSession.startDate))}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currentSession.selectedVarieties && currentSession.selectedVarieties.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
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
              <div className="pt-2 border-t border-green-200 flex justify-between items-center">
                <div className="flex items-center gap-1 text-green-800">
                  <InfoIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Fin de récolte estimée</span>
                </div>
                <Badge className="bg-green-700">
                  {formatDateToLocale(getMaxHarvestDateForSession(currentSession))}
                </Badge>
              </div>
            </>
          ) : (
            <p className="text-sm text-green-800">Aucune variété sélectionnée pour cette session.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveSessionCard;
