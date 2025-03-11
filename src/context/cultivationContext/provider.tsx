
import { createContext, useContext, ReactNode } from 'react';
import { CultivationContextType } from '../types';
import { getPlantOperations } from '../plantOperations';
import { getAlertOperations } from '../alertOperations';
import { getFertilizerOperations } from '../fertilizerOperations';
import { getVarietyOperations } from '../varietyOperations';
import { getSessionOperations } from '../sessionOperations';
import { useCultivationState } from './hooks/useCultivationState';
import { useSupabaseFetch } from './hooks/useSupabaseFetch';
import { useSessionInitialization } from './hooks/useSessionInitialization';
import { useCultivationPlantUpdates } from './useCultivationPlantUpdates';

const CultivationContext = createContext<CultivationContextType | undefined>(undefined);

export const CultivationProvider = ({ children }: { children: ReactNode }) => {
  const {
    spaces, setSpaces,
    varieties, setVarieties,
    alerts, setAlerts,
    fertilizers, setFertilizers,
    selectedSpaceId, setSelectedSpaceId,
    selectedPlantIds, setSelectedPlantIds,
    sessions, setSessions,
    currentSession, setCurrentSessionState,
    selectedRoomType, setSelectedRoomType,
    isLoading, setIsLoading,
    getSpacesByRoomType
  } = useCultivationState();

  const alertOps = getAlertOperations(alerts, setAlerts);
  const { addAlert, markAlertAsRead, clearAllAlerts } = alertOps;

  const plantOps = getPlantOperations(spaces, setSpaces, addAlert);
  const { 
    getPlantById, 
    getSpaceById, 
    updatePlant, 
    updatePlantBatch,
    updatePlantState,
    updatePlantsBatchState,
    updatePlantEC,
    updatePlantPH, 
    updatePlantsInSpace,
    updatePlantsInRow,
    transferPlantToFlowering,
    deleteRow,
    addRow
  } = plantOps;

  const fertilizerOps = getFertilizerOperations(fertilizers, setFertilizers, addAlert);
  const { 
    addFertilizer, 
    updateFertilizer, 
    deleteFertilizer, 
    getFertilizerById 
  } = fertilizerOps;

  const varietyOps = getVarietyOperations(varieties, setVarieties, spaces, setSpaces, addAlert);
  const { 
    addVariety, 
    updateVariety, 
    deleteVariety 
  } = varietyOps;

  const sessionOps = getSessionOperations(
    sessions, 
    setSessions, 
    currentSession, 
    setCurrentSessionState, 
    varieties, 
    addAlert
  );
  
  const {
    startCultivationSession,
    endCultivationSession,
    setCurrentSession,
    getSessionById,
    deleteSession,
    updateSession,
    getEstimatedHarvestDateForVariety,
    getMaxHarvestDateForSession
  } = sessionOps;

  const getEstimatedFloweringDate = (plantId: string) => 
    sessionOps.getEstimatedFloweringDate(plantId, getPlantById);
  
  const getEstimatedHarvestDate = (plantId: string) => 
    sessionOps.getEstimatedHarvestDate(plantId, getPlantById);

  // Initialize data fetching hooks
  useSupabaseFetch(setVarieties, setIsLoading, addAlert);
  useSessionInitialization(setSessions, setCurrentSessionState, addAlert);

  // Plant updates and management hooks
  useCultivationPlantUpdates({
    currentSession,
    spaces,
    updatePlantState,
    addAlert,
    transferPlantToFlowering,
    getSpacesByRoomType
  });

  return (
    <CultivationContext.Provider
      value={{
        spaces,
        varieties,
        fertilizers,
        alerts,
        selectedSpaceId,
        selectedPlantIds,
        sessions,
        currentSession,
        selectedRoomType,
        setSelectedSpaceId,
        setSelectedPlantIds,
        setSelectedRoomType,
        getSpacesByRoomType,
        getPlantById,
        getSpaceById,
        updatePlant,
        updatePlantBatch,
        updatePlantState,
        updatePlantsBatchState,
        updatePlantEC,
        updatePlantPH,
        updatePlantsInSpace,
        updatePlantsInRow,
        addAlert,
        markAlertAsRead,
        clearAllAlerts,
        addFertilizer,
        updateFertilizer,
        deleteFertilizer,
        getFertilizerById,
        addVariety,
        updateVariety,
        deleteVariety,
        startCultivationSession,
        endCultivationSession,
        setCurrentSession,
        getSessionById,
        deleteSession,
        updateSession,
        getEstimatedFloweringDate,
        getEstimatedHarvestDate,
        getEstimatedHarvestDateForVariety,
        getMaxHarvestDateForSession,
        transferPlantToFlowering,
        deleteRow,
        addRow
      }}
    >
      {children}
    </CultivationContext.Provider>
  );
};

export const useCultivation = () => {
  const context = useContext(CultivationContext);
  if (context === undefined) {
    throw new Error('useCultivation must be used within a CultivationProvider');
  }
  return context;
};
