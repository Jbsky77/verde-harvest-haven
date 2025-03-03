
import { PlantVariety } from '@/types';
import { CultivationSession } from '../types';

export const getPlantTimingOperations = (
  currentSession: CultivationSession | null,
  varieties: PlantVariety[]
) => {
  const getEstimatedFloweringDate = (plantId: string, getPlantById: (id: string) => any): Date | null => {
    if (!currentSession) return null;
    
    const plant = getPlantById(plantId);
    if (!plant) return null;
    
    const variety = plant.variety;
    if (!variety.germinationTime || !variety.growthTime) return null;
    
    const germStartDate = new Date(currentSession.startDate);
    const floweringDate = new Date(germStartDate);
    floweringDate.setDate(floweringDate.getDate() + variety.germinationTime + variety.growthTime);
    
    return floweringDate;
  };

  const getEstimatedHarvestDate = (plantId: string, getPlantById: (id: string) => any): Date | null => {
    if (!currentSession) return null;
    
    const plant = getPlantById(plantId);
    if (!plant) return null;
    
    const variety = plant.variety;
    if (!variety.germinationTime || !variety.growthTime || !variety.floweringTime) return null;
    
    const germStartDate = new Date(currentSession.startDate);
    const harvestDate = new Date(germStartDate);
    harvestDate.setDate(harvestDate.getDate() + variety.germinationTime + variety.growthTime + variety.floweringTime);
    
    return harvestDate;
  };

  const getEstimatedHarvestDateForVariety = (varietyId: string): Date | null => {
    if (!currentSession) return null;
    
    const variety = varieties.find(v => v.id === varietyId);
    if (!variety || !variety.germinationTime || !variety.growthTime || !variety.floweringTime) return null;
    
    const germStartDate = new Date(currentSession.startDate);
    const harvestDate = new Date(germStartDate);
    harvestDate.setDate(harvestDate.getDate() + variety.germinationTime + variety.growthTime + variety.floweringTime);
    
    return harvestDate;
  };

  const getMaxHarvestDateForSession = (session: CultivationSession): Date | null => {
    if (!session.selectedVarieties || session.selectedVarieties.length === 0) return null;
    
    let maxDate: Date | null = null;
    
    for (const varietyId of session.selectedVarieties) {
      const variety = varieties.find(v => v.id === varietyId);
      if (!variety || !variety.germinationTime || !variety.growthTime || !variety.floweringTime) continue;
      
      const germStartDate = new Date(session.startDate);
      const harvestDate = new Date(germStartDate);
      harvestDate.setDate(harvestDate.getDate() + variety.germinationTime + variety.growthTime + variety.floweringTime);
      
      if (!maxDate || harvestDate > maxDate) {
        maxDate = harvestDate;
      }
    }
    
    return maxDate;
  };

  return {
    getEstimatedFloweringDate,
    getEstimatedHarvestDate,
    getEstimatedHarvestDateForVariety,
    getMaxHarvestDateForSession
  };
};
