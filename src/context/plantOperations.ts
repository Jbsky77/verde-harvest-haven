
import { Plant, PlantState, CultivationSpace } from '@/types';
import { CultivationContextType } from './types';

export const getPlantOperations = (
  spaces: CultivationSpace[],
  setSpaces: React.Dispatch<React.SetStateAction<CultivationSpace[]>>,
  addAlert: CultivationContextType['addAlert']
) => {
  const getPlantById = (id: string): Plant | undefined => {
    for (const space of spaces) {
      const plant = space.plants.find(p => p.id === id);
      if (plant) return plant;
    }
    return undefined;
  };

  const getSpaceById = (id: number): CultivationSpace | undefined => {
    return spaces.find(space => space.id === id);
  };

  const updatePlant = (updatedPlant: Plant) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => {
        if (space.id === updatedPlant.position.space) {
          return {
            ...space,
            plants: space.plants.map(plant => 
              plant.id === updatedPlant.id ? updatedPlant : plant
            )
          };
        }
        return space;
      })
    );
  };

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

  const updatePlantState = (plantId: string, state: PlantState) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plant.id === plantId 
            ? { ...plant, state, lastUpdated: new Date() } 
            : plant
        )
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

  const updatePlantEC = (plantId: string, ec: number) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plant.id === plantId 
            ? { ...plant, ec, lastUpdated: new Date() } 
            : plant
        )
      }))
    );

    if (ec < 0.8 || ec > 1.6) {
      const plant = getPlantById(plantId);
      if (plant) {
        addAlert({
          type: "warning",
          message: `EC ${ec < 0.8 ? "trop bas" : "trop élevé"} pour la plante en Espace ${plant.position.space}, Ligne ${plant.position.row}, Colonne ${plant.position.column}`,
          plantId,
          spaceId: plant.position.space
        });
      }
    }
  };

  const updatePlantPH = (plantId: string, ph: number) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plant.id === plantId 
            ? { ...plant, ph, lastUpdated: new Date() } 
            : plant
        )
      }))
    );

    if (ph < 5.5 || ph > 6.5) {
      const plant = getPlantById(plantId);
      if (plant) {
        addAlert({
          type: "warning",
          message: `pH ${ph < 5.5 ? "trop bas" : "trop élevé"} pour la plante en Espace ${plant.position.space}, Ligne ${plant.position.row}, Colonne ${plant.position.column}`,
          plantId,
          spaceId: plant.position.space
        });
      }
    }
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
    getPlantById,
    getSpaceById,
    updatePlant,
    updatePlantBatch,
    updatePlantState,
    updatePlantsBatchState,
    updatePlantEC,
    updatePlantPH,
    updatePlantsInSpace,
    updatePlantsInRow
  };
};
