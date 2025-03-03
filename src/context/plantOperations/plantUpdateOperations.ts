
import { Plant, PlantState, CultivationSpace } from '@/types';
import { CultivationContextType } from '@/context/types';

export const getPlantUpdateOperations = (
  spaces: CultivationSpace[],
  setSpaces: React.Dispatch<React.SetStateAction<CultivationSpace[]>>,
  addAlert: CultivationContextType['addAlert']
) => {
  // Helper function to find a plant by ID
  const getPlantById = (id: string): Plant | undefined => {
    for (const space of spaces) {
      const plant = space.plants.find(p => p.id === id);
      if (plant) return plant;
    }
    return undefined;
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

  return {
    updatePlant,
    updatePlantState,
    updatePlantEC,
    updatePlantPH
  };
};
