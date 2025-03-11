
import { useCultivation } from "@/context/cultivationContext";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PlantVariety } from "@/types";

interface SessionChartSectionProps {
  currentSession: any;
  formatDateToLocale: (date: Date | null) => string;
  startDate: Date;
  totalDuration: number;
  elapsedDays: number;
  progressPercent: number;
  maxHarvestDate: Date | null;
}

export const SessionChartSection = ({ 
  currentSession, 
  formatDateToLocale, 
  startDate, 
  totalDuration, 
  elapsedDays, 
  progressPercent, 
  maxHarvestDate
}: SessionChartSectionProps) => {
  const { varieties } = useCultivation();
  
  const generateChartData = () => {
    if (!currentSession.selectedVarieties) return [];
    
    const data = [];
    const sessionDays = Math.ceil(totalDuration);
    
    for (let day = 0; day <= sessionDays; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      
      const dataPoint: any = {
        day,
        date: formatDateToLocale(date),
      };
      
      currentSession.selectedVarieties.forEach((varietyId: string) => {
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
  const currentDayMarker = Math.floor(elapsedDays);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-green-800">Progression globale</span>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white text-green-800">
            {progressPercent}%
          </Badge>
          <span className="text-xs text-green-700">
            Fin estimée: {formatDateToLocale(maxHarvestDate)}
          </span>
        </div>
      </div>
      
      <div className="h-48 mt-4 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              {currentSession.selectedVarieties?.map((varietyId: string, index: number) => {
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
            
            {currentSession.selectedVarieties?.map((varietyId: string) => {
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
      
      <div className="flex flex-wrap gap-2 mt-1 mb-3">
        {currentSession.selectedVarieties?.map((varietyId: string) => {
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
    </div>
  );
};
