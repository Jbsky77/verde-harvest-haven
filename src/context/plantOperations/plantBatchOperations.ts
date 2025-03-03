
import { Plant, PlantState, CultivationSpace } from '@/types';

export const getPlantBatchOperations = (
  spaces: CultivationSpace[],
  setSpaces: React.Dispatch<React.SetStateAction<CultivationSpace[]>>
) => {
  const updatePlantBatch = (updatedPlants: Plant[]) => {
    const plantIds = new Set(updatedPlants.map(p => p.id));
    
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => {
          if (plantIds.has(plant.id)) {
            const updatedPlant = updatedPlants.find(p => p.id === plant.id);
            return updatedPlant || plant;
          }
          return plant;
        })
      }))
    );
  };

  const updatePlantsBatchState = (plantIds: string[], state: PlantState) => {
    const plantIdSet = new Set(plantIds);
    
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plantIdSet.has(plant.id) 
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

  return {
    updatePlantBatch,
    updatePlantsBatchState,
    updatePlantsInSpace,
    updatePlantsInRow
  };
};
