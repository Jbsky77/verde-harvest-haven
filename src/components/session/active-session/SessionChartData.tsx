import { PlantVariety } from "@/types";
import { CultivationSession } from "@/context/types";

export const generateChartData = (
  currentSession: CultivationSession,
  varieties: PlantVariety[],
  startDate: Date,
  totalDuration: number,
  formatDateToLocale: (date: Date | null) => string
) => {
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
