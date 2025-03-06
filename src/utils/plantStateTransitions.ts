
import { Plant, PlantState, RoomType, CultivationSpace } from "@/types";
import { CultivationSession } from "@/context/types";

/**
 * Determines if a plant needs to be moved from growth room to flowering room
 * based on its growth time and the current session
 */
export const shouldTransferToFlowering = (
  plant: Plant,
  currentSession: CultivationSession | null,
): boolean => {
  if (!currentSession || !currentSession.isActive) return false;
  if (plant.state !== "growth" || plant.position.roomType !== "growth") return false;
  
  const { variety } = plant;
  if (!variety.germinationTime || !variety.growthTime) return false;
  
  const startDate = new Date(currentSession.startDate);
  const currentDate = new Date();
  
  // Calculate days elapsed since session start
  const daysElapsed = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Plant should be transferred to flowering if it has completed its growth time
  return daysElapsed >= (variety.germinationTime + variety.growthTime);
};

/**
 * Determines the expected state of a plant based on room type
 */
export const determineExpectedPlantState = (
  plant: Plant,
  currentSession: CultivationSession | null,
): PlantState | null => {
  if (!currentSession || !currentSession.isActive) return null;
  
  // For growth room, state should be "growth"
  if (plant.position.roomType === "growth") {
    return "growth";
  } 
  // For flowering room, state should be "flowering"
  else if (plant.position.roomType === "flowering") {
    return "flowering";
  }
  
  return null;
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

/**
 * Identifies plants that need to be transferred to the flowering room
 */
export const findPlantsForFloweringTransfer = (
  spaces: CultivationSpace[],
  currentSession: CultivationSession | null
): Plant[] => {
  if (!currentSession || !currentSession.isActive) return [];
  
  // Get all plants from growth rooms
  const growthRoomPlants = spaces
    .filter(space => space.roomType === "growth")
    .flatMap(space => space.plants);
  
  // Return plants that should be transferred to flowering
  return growthRoomPlants.filter(plant => 
    shouldTransferToFlowering(plant, currentSession)
  );
};
