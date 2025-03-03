
import { Fertilizer } from '@/types';
import { CultivationContextType } from './types';

export const getFertilizerOperations = (
  fertilizers: Fertilizer[],
  setFertilizers: React.Dispatch<React.SetStateAction<Fertilizer[]>>,
  addAlert: (alert: Parameters<CultivationContextType['addAlert']>[0]) => void
) => {
  const addFertilizer = (fertilizer: Omit<Fertilizer, 'id' | 'createdAt' | 'color'> & { color: string }) => {
    const newFertilizer: Fertilizer = {
      ...fertilizer,
      id: `fert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      isCustom: true
    };
    
    setFertilizers(prev => [...prev, newFertilizer]);
    
    addAlert({
      type: "success",
      message: `Nouvel engrais "${newFertilizer.name}" ajouté avec succès`
    });
  };

  const updateFertilizer = (updatedFertilizer: Fertilizer) => {
    setFertilizers(prev => 
      prev.map(fertilizer => 
        fertilizer.id === updatedFertilizer.id ? updatedFertilizer : fertilizer
      )
    );
    
    addAlert({
      type: "info",
      message: `Engrais "${updatedFertilizer.name}" mis à jour avec succès`
    });
  };

  const deleteFertilizer = (id: string) => {
    const fertilizer = getFertilizerById(id);
    if (fertilizer) {
      setFertilizers(prev => prev.filter(f => f.id !== id));
      
      addAlert({
        type: "info",
        message: `Engrais "${fertilizer.name}" supprimé avec succès`
      });
    }
  };

  const getFertilizerById = (id: string): Fertilizer | undefined => {
    return fertilizers.find(f => f.id === id);
  };

  return {
    addFertilizer,
    updateFertilizer,
    deleteFertilizer,
    getFertilizerById
  };
};
