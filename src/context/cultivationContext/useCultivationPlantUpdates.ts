
import { useEffect } from 'react';
import { Plant, CultivationSpace, RoomType, PlantState } from '@/types';
import { CultivationSession } from '../types';
import { 
  findPlantsNeedingStateUpdate, 
  findPlantsForFloweringTransfer 
} from '@/utils/plantStateTransitions';

interface UseCultivationPlantUpdatesProps {
  currentSession: CultivationSession | null;
  spaces: CultivationSpace[];
  updatePlantState: (plantId: string, state: PlantState) => void;
  addAlert: (alert: any) => void;
  transferPlantToFlowering: (plantId: string, targetSpaceId: number) => void;
  getSpacesByRoomType: (roomType: RoomType) => CultivationSpace[];
}

export const useCultivationPlantUpdates = ({
  currentSession,
  spaces,
  updatePlantState,
  addAlert,
  transferPlantToFlowering,
  getSpacesByRoomType
}: UseCultivationPlantUpdatesProps) => {
  
  // Check and update plant states based on time intervals
  const checkAndUpdatePlantStates = () => {
    if (!currentSession || !currentSession.isActive) return;
    
    const allPlants = spaces.flatMap(space => space.plants);
    
    const plantsNeedingUpdate = findPlantsNeedingStateUpdate(allPlants, currentSession, spaces);
    
    if (plantsNeedingUpdate.length > 0) {
      plantsNeedingUpdate.forEach(({ plant, newState }) => {
        updatePlantState(plant.id, newState);
        
        addAlert({
          type: "info",
          message: `${plant.variety.name} en Espace ${plant.position.space}, L${plant.position.row}-C${plant.position.column} est passée à l'état: ${newState}`,
          plantId: plant.id,
          spaceId: plant.position.space
        });
      });
    }
  };

  // Check and transfer plants that need to be moved to flowering space
  const checkAndTransferPlants = () => {
    if (!currentSession || !currentSession.isActive) return;
    
    const plantsForTransfer = findPlantsForFloweringTransfer(spaces, currentSession);
    
    if (plantsForTransfer.length > 0) {
      plantsForTransfer.forEach(plant => {
        const floweringSpaces = getSpacesByRoomType("flowering");
        if (floweringSpaces.length === 0) return;
        
        const targetSpace = floweringSpaces[0];
        
        transferPlantToFlowering(plant.id, targetSpace.id);
        
        addAlert({
          type: "success",
          message: `${plant.variety.name} transférée de l'Espace ${plant.position.space} (Croissance) vers l'Espace ${targetSpace.id} (Floraison)`,
          plantId: plant.id,
          spaceId: targetSpace.id
        });
      });
    }
  };

  // Run the checks periodically
  useEffect(() => {
    // Run initial checks
    checkAndUpdatePlantStates();
    checkAndTransferPlants();
    
    // Set up interval for periodic checks
    const intervalId = setInterval(() => {
      checkAndUpdatePlantStates();
      checkAndTransferPlants();
    }, 60 * 60 * 1000); // Check every hour
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [currentSession, spaces]);

  return null;
};
