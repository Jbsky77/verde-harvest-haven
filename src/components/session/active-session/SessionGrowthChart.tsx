
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PlantVariety } from "@/types";

interface SessionGrowthChartProps {
  chartData: any[];
  varieties: PlantVariety[];
  selectedVarieties?: string[];
  currentDayMarker: number;
  formatDateToLocale: (date: Date | null) => string;
}

export const SessionGrowthChart = ({
  chartData,
  varieties,
  selectedVarieties,
  currentDayMarker,
  formatDateToLocale
}: SessionGrowthChartProps) => {
  return (
    <div className="h-48 mt-4 mb-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            {selectedVarieties?.map((varietyId) => {
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
              if (day === 0 || day === Math.floor(chartData.length - 1) || day === currentDayMarker) {
                const date = chartData[day]?.date;
                return date ? date.split('/').slice(0, 2).join('/') : '';
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
              const dataPoint = chartData[day];
              return dataPoint ? `Jour ${day}: ${dataPoint.date}` : `Jour ${day}`;
            }}
          />
          
          {selectedVarieties?.map((varietyId) => {
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
  );
};
