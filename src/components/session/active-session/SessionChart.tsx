
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PlantVariety } from "@/types";
import { CultivationSession } from "@/context/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface SessionChartProps {
  chartData: any[];
  currentSession: CultivationSession;
  varieties: PlantVariety[];
  currentDayMarker: number;
  totalDuration: number;
  startDate: Date;
  formatDateToLocale: (date: Date | null) => string;
}

export const SessionChart = ({
  chartData,
  currentSession,
  varieties,
  currentDayMarker,
  totalDuration,
  startDate,
  formatDateToLocale
}: SessionChartProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={`${isMobile ? 'h-40' : 'h-48'} mt-4 mb-6`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={isMobile ? { top: 5, right: 5, left: -15, bottom: 5 } : {}}>
          <defs>
            {currentSession.selectedVarieties?.map((varietyId) => {
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
            tick={{fontSize: isMobile ? 8 : 10}}
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
            tick={{fontSize: isMobile ? 8 : 10}} 
            domain={[0, 100]}
            tickFormatter={(value) => {
              if (value === 0) return 'Début';
              if (value === 25) return 'Germ.';
              if (value === 50) return 'Croiss.';
              if (value === 75) return 'Floraison';
              if (value === 100) return 'Récolte';
              return '';
            }}
            width={isMobile ? 40 : 50}
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
    </div>
  );
};
