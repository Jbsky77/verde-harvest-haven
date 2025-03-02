
import { useCultivation } from "@/context/CultivationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, CalendarIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

  // Calculate session progress
  const startDate = new Date(currentSession.startDate);
  const today = new Date();
  const maxHarvestDate = getMaxHarvestDateForSession(currentSession);
  
  const totalDuration = maxHarvestDate ? 
    (maxHarvestDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) : 
    90; // Default to 90 days if no harvest date
  
  const elapsedDays = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const progressPercent = Math.min(Math.max(Math.round((elapsedDays / totalDuration) * 100), 0), 100);
  
  // Generate chart data
  const generateChartData = () => {
    if (!currentSession.selectedVarieties) return [];
    
    const data = [];
    const sessionDays = Math.ceil(totalDuration);
    
    // Generate data points for variety growth phases
    for (let day = 0; day <= sessionDays; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      
      const dataPoint: any = {
        day,
        date: formatDateToLocale(date),
      };
      
      currentSession.selectedVarieties.forEach(varietyId => {
        const variety = varieties.find(v => v.id === varietyId);
        if (!variety || !variety.germinationTime || !variety.growthTime || !variety.floweringTime) return;
        
        const germDays = variety.germinationTime;
        const growthDays = variety.growthTime;
        const floweringDays = variety.floweringTime;
        
        let phase = "none";
        if (day <= germDays) {
          phase = "germination";
        } else if (day <= germDays + growthDays) {
          phase = "growth";
        } else if (day <= germDays + growthDays + floweringDays) {
          phase = "flowering";
        } else {
          phase = "harvest";
        }
        
        dataPoint[`${variety.name}`] = phase === "germination" ? 25 :
                                     phase === "growth" ? 50 :
                                     phase === "flowering" ? 75 :
                                     phase === "harvest" ? 100 : 0;
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };
  
  const chartData = generateChartData();
  
  // Calculate current day marker position
  const currentDayMarker = Math.floor(elapsedDays);

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
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">Progression globale</span>
            <Badge variant="outline" className="bg-white text-green-800">
              {progressPercent}%
            </Badge>
          </div>
          
          {/* Growth phase chart */}
          <div className="h-48 mt-4 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  {currentSession.selectedVarieties?.map((varietyId, index) => {
                    const variety = varieties.find(v => v.id === varietyId);
                    if (!variety) return null;
                    return (
                      <linearGradient key={varietyId} id={`color${varietyId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={variety.color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={variety.color} stopOpacity={0.2}/>
                      </linearGradient>
                    );
                  })}
                </defs>
                <XAxis 
                  dataKey="day" 
                  tick={{fontSize: 10}}
                  tickFormatter={(day) => {
                    // Show key dates only
                    if (day === 0 || day === Math.floor(totalDuration) || day === currentDayMarker) {
                      const date = new Date(startDate);
                      date.setDate(date.getDate() + Number(day));
                      return formatDateToLocale(date).split('/').slice(0, 2).join('/');
                    }
                    return '';
                  }}
                />
                <YAxis 
                  tick={{fontSize: 10}} 
                  domain={[0, 100]}
                  tickFormatter={(value) => {
                    if (value === 0) return 'Début';
                    if (value === 25) return 'Germ.';
                    if (value === 50) return 'Croiss.';
                    if (value === 75) return 'Floraison';
                    if (value === 100) return 'Récolte';
                    return '';
                  }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    // Cast value to number before comparing
                    const numValue = Number(value);
                    const phase = 
                      numValue <= 25 ? "Germination" :
                      numValue <= 50 ? "Croissance" :
                      numValue <= 75 ? "Floraison" : "Récolte";
                    return [phase, name];
                  }}
                  labelFormatter={(day) => {
                    const date = new Date(startDate);
                    date.setDate(date.getDate() + Number(day));
                    return `Jour ${day}: ${formatDateToLocale(date)}`;
                  }}
                />
                
                {currentSession.selectedVarieties?.map((varietyId) => {
                  const variety = varieties.find(v => v.id === varietyId);
                  if (!variety) return null;
                  return (
                    <Area 
                      key={varietyId}
                      type="monotone" 
                      dataKey={variety.name}
                      stroke={variety.color} 
                      fillOpacity={1}
                      fill={`url(#color${varietyId})`}
                    />
                  );
                })}
                
                {/* Current day marker */}
                <XAxis 
                  dataKey="day"
                  xAxisId="current-day"
                  axisLine={false} 
                  tickLine={false}
                  tick={false}
                  height={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-1 mb-3">
            {currentSession.selectedVarieties?.map((varietyId) => {
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
          
          {/* Variety list */}
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
