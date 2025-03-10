
import { Plant, PlantState, CultivationSpace, PlantVariety } from '@/types';
import { CultivationContextType } from '@/context/types';
import { getPlantRetrievalOperations } from './plantRetrievalOperations';
import { getPlantUpdateOperations } from './plantUpdateOperations';
import { getPlantBatchOperations } from './plantBatchOperations';

export const getPlantOperations = (
  spaces: CultivationSpace[],
  setSpaces: React.Dispatch<React.SetStateAction<CultivationSpace[]>>,
  addAlert: CultivationContextType['addAlert']
) => {
  // Get retrieval operations
  const retrievalOps = getPlantRetrievalOperations(spaces);
  const { getPlantById, getSpaceById } = retrievalOps;

  // Get update operations
  const updateOps = getPlantUpdateOperations(spaces, setSpaces, addAlert);
  const { 
    updatePlant, 
    updatePlantState, 
    updatePlantEC, 
    updatePlantPH 
  } = updateOps;

  // Get batch operations
  const batchOps = getPlantBatchOperations(spaces, setSpaces);
  const { 
    updatePlantBatch, 
    updatePlantsBatchState, 
    updatePlantsInSpace, 
    updatePlantsInRow,
    transferPlantToFlowering,
    deleteRow,
    addRow
  } = batchOps;

  return {
    // Plant retrieval operations
    getPlantById,
    getSpaceById,
    
    // Plant update operations
    updatePlant,
    updatePlantState,
    updatePlantEC,
    updatePlantPH,
    
    // Batch update operations
    updatePlantBatch,
    updatePlantsBatchState,
    updatePlantsInSpace,
    updatePlantsInRow,
    transferPlantToFlowering,
    deleteRow,
    addRow
  };
};
