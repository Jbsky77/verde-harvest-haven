
import { PlantVariety } from '@/types';
import { CultivationContextType } from './types';
import { CultivationSpace } from '@/types';

export const getVarietyOperations = (
  varieties: PlantVariety[],
  setVarieties: React.Dispatch<React.SetStateAction<PlantVariety[]>>,
  spaces: CultivationSpace[],
  setSpaces: React.Dispatch<React.SetStateAction<CultivationSpace[]>>,
  addAlert: (alert: Parameters<CultivationContextType['addAlert']>[0]) => void
) => {
  const addVariety = (variety: Omit<PlantVariety, 'id'>) => {
    const newVariety: PlantVariety = {
      ...variety,
      id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      germinationTime: variety.germinationTime ? Number(variety.germinationTime) : undefined,
      growthTime: variety.growthTime ? Number(variety.growthTime) : undefined,
      floweringTime: variety.floweringTime ? Number(variety.floweringTime) : undefined
    };
    
    setVarieties(prev => [...prev, newVariety]);
    
    addAlert({
      type: "success",
      message: `Nouvelle variété "${newVariety.name}" ajoutée avec succès`
    });
  };

  const updateVariety = (updatedVariety: PlantVariety) => {
    const varietyToUpdate = {
      ...updatedVariety,
      germinationTime: updatedVariety.germinationTime ? Number(updatedVariety.germinationTime) : undefined,
      growthTime: updatedVariety.growthTime ? Number(updatedVariety.growthTime) : undefined,
      floweringTime: updatedVariety.floweringTime ? Number(updatedVariety.floweringTime) : undefined
    };
    
    setVarieties(prev => 
      prev.map(variety => 
        variety.id === varietyToUpdate.id ? varietyToUpdate : variety
      )
    );
    
    setSpaces(prevSpaces =>
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plant.variety.id === varietyToUpdate.id
            ? { ...plant, variety: varietyToUpdate }
            : plant
        )
      }))
    );
    
    addAlert({
      type: "info",
      message: `Variété "${varietyToUpdate.name}" mise à jour avec succès`
    });
  };

  const deleteVariety = (id: string) => {
    const variety = varieties.find(v => v.id === id);
    if (!variety) return;
    
    let isUsed = false;
    for (const space of spaces) {
      if (space.plants.some(p => p.variety.id === id)) {
        isUsed = true;
        break;
      }
    }
    
    if (isUsed) {
      addAlert({
        type: "error",
        message: `Impossible de supprimer la variété "${variety.name}" car elle est utilisée par des plantes`
      });
      return;
    }
    
    setVarieties(prev => prev.filter(v => v.id !== id));
    
    addAlert({
      type: "info",
      message: `Variété "${variety.name}" supprimée avec succès`
    });
  };

  return {
    addVariety,
    updateVariety,
    deleteVariety
  };
};
