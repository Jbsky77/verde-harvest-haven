
import { Plant, PlantState, CultivationSpace } from '@/types';

export const getPlantBatchOperations = (
  spaces: CultivationSpace[],
  setSpaces: React.Dispatch<React.SetStateAction<CultivationSpace[]>>
) => {
  const updatePlantBatch = (plants: Plant[]) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => {
          const updatedPlant = plants.find(p => p.id === plant.id);
          return updatedPlant ? updatedPlant : plant;
        })
      }))
    );
  };

  const updatePlantsBatchState = (plantIds: string[], state: PlantState) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plantIds.includes(plant.id) 
            ? { ...plant, state, lastUpdated: new Date() } 
            : plant
        )
      }))
    );
  };

  const updatePlantsInSpace = (spaceId: number, updates: Partial<Plant>) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => {
        if (space.id === spaceId) {
          return {
            ...space,
            plants: space.plants.map(plant => ({
              ...plant,
              ...updates,
              lastUpdated: new Date()
            }))
          };
        }
        return space;
      })
    );
  };

  const updatePlantsInRow = (spaceId: number, row: number, updates: Partial<Plant>) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => {
        if (space.id === spaceId) {
          return {
            ...space,
            plants: space.plants.map(plant => 
              plant.position.row === row 
                ? { ...plant, ...updates, lastUpdated: new Date() } 
                : plant
            )
          };
        }
        return space;
      })
    );
  };

  // New function to transfer a plant from growth to flowering room
  const transferPlantToFlowering = (plantId: string, targetSpaceId: number) => {
    setSpaces(prevSpaces => {
      // Find the plant in the current spaces
      let plantToTransfer: Plant | null = null;
      let sourceSpaceId: number | null = null;
      
      // Find the plant and its source space
      for (const space of prevSpaces) {
        const plant = space.plants.find(p => p.id === plantId);
        if (plant) {
          plantToTransfer = { ...plant };
          sourceSpaceId = space.id;
          break;
        }
      }
      
      if (!plantToTransfer || !sourceSpaceId) return prevSpaces;
      
      // Get target space
      const targetSpace = prevSpaces.find(s => s.id === targetSpaceId);
      if (!targetSpace || targetSpace.roomType !== "flowering") return prevSpaces;
      
      // Create an updated version of the plant for the flowering room
      const updatedPlant: Plant = {
        ...plantToTransfer,
        state: "flowering", // Update state to flowering
        position: {
          ...plantToTransfer.position,
          space: targetSpaceId, // Update space ID
        },
        lastUpdated: new Date()
      };
      
      // Remove plant from source space and add to target space
      return prevSpaces.map(space => {
        if (space.id === sourceSpaceId) {
          // Remove plant from source space
          return {
            ...space,
            plants: space.plants.filter(p => p.id !== plantId)
          };
        } else if (space.id === targetSpaceId) {
          // Add plant to target space
          return {
            ...space,
            plants: [...space.plants, updatedPlant]
          };
        }
        return space;
      });
    });
  };

  return {
    updatePlantBatch,
    updatePlantsBatchState,
    updatePlantsInSpace,
    updatePlantsInRow,
    transferPlantToFlowering
  };
};
