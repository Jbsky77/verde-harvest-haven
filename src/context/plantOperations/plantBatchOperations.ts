
import { Plant, PlantState, CultivationSpace, PlantVariety } from '@/types';
import { v4 as uuidv4 } from 'uuid';

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

  // Function to delete a row of plants
  const deleteRow = (spaceId: number, rowToDelete: number) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => {
        if (space.id === spaceId) {
          // Remove plants in the selected row
          const filteredPlants = space.plants.filter(plant => 
            plant.position.row !== rowToDelete
          );
          
          // Reposition remaining plants' row numbers if needed
          const repositionedPlants = filteredPlants.map(plant => {
            if (plant.position.row > rowToDelete) {
              return {
                ...plant,
                position: {
                  ...plant.position,
                  row: plant.position.row - 1
                },
                lastUpdated: new Date()
              };
            }
            return plant;
          });
          
          return {
            ...space,
            plants: repositionedPlants,
            rows: space.rows > 0 ? space.rows - 1 : 0
          };
        }
        return space;
      })
    );
  };

  // Function to add a new row of plants with a specific variety
  const addRow = (spaceId: number, variety: PlantVariety) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => {
        if (space.id === spaceId) {
          const newRowNumber = space.rows + 1;
          const newPlants: Plant[] = [];
          
          // Create new plants for the row
          for (let column = 1; column <= space.plantsPerRow; column++) {
            newPlants.push({
              id: uuidv4(),
              position: {
                space: spaceId,
                row: newRowNumber,
                column
              },
              variety,
              state: space.roomType === "growth" ? "germination" : "flowering",
              ec: 1.2,
              ph: 6.0,
              lastUpdated: new Date()
            });
          }
          
          return {
            ...space,
            plants: [...space.plants, ...newPlants],
            rows: newRowNumber
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
    transferPlantToFlowering,
    deleteRow,
    addRow
  };
};
