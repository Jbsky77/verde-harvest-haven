
import { Plant, PlantState } from "@/types";
import { CultivationSession } from "@/context/types";

/**
 * Determines the expected state of a plant based on the current date and session start date
 */
export const determineExpectedPlantState = (
  plant: Plant,
  currentSession: CultivationSession | null,
): PlantState | null => {
  if (!currentSession || !currentSession.isActive) return null;
  
  const { variety } = plant;
  if (!variety.germinationTime || !variety.growthTime || !variety.floweringTime) return null;
  
  const startDate = new Date(currentSession.startDate);
  const currentDate = new Date();
  
  // Calculate days elapsed since session start
  const daysElapsed = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Determine state based on elapsed time
  if (daysElapsed <= variety.germinationTime) {
    return "germination";
  } else if (daysElapsed <= variety.germinationTime + variety.growthTime) {
    return "growth";
  } else if (daysElapsed <= variety.germinationTime + variety.growthTime + variety.floweringTime) {
    return "flowering";
  } else {
    return "harvested";
  }
};

/**
 * Checks all plants and returns plants that need state updates
 */
export const findPlantsNeedingStateUpdate = (
  plants: Plant[],
  currentSession: CultivationSession | null
): { plant: Plant; newState: PlantState }[] => {
  if (!currentSession || !currentSession.isActive) return [];
  
  const plantsToUpdate: { plant: Plant; newState: PlantState }[] = [];
  
  plants.forEach(plant => {
    const expectedState = determineExpectedPlantState(plant, currentSession);
    
    // Only update if the expected state exists and is different from current state
    if (expectedState && expectedState !== plant.state) {
      // Don't automatically change from harvested or drying state
      if (plant.state !== "harvested" && plant.state !== "drying") {
        plantsToUpdate.push({ plant, newState: expectedState });
      }
    }
  });
  
  return plantsToUpdate;
};
