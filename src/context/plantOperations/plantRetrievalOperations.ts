
import { Plant, CultivationSpace } from '@/types';

export const getPlantRetrievalOperations = (spaces: CultivationSpace[]) => {
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

  return {
    getPlantById,
    getSpaceById
  };
};
