
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert, Plant, PlantState, PlantVariety } from '@/types';
import { SessionService } from '@/services/SessionService';
import { CultivationContextType, CultivationSession } from './types';
import { generateInitialSpaces, initialVarieties, initialFertilizers } from './initialData';
import { getPlantOperations } from './plantOperations';
import { getAlertOperations } from './alertOperations';
import { getFertilizerOperations } from './fertilizerOperations';
import { getVarietyOperations } from './varietyOperations';
import { getSessionOperations } from './sessionOperations';

const CultivationContext = createContext<CultivationContextType | undefined>(undefined);

export const CultivationProvider = ({ children }: { children: ReactNode }) => {
  const [spaces, setSpaces] = useState(generateInitialSpaces);
  const [varieties, setVarieties] = useState<PlantVariety[]>(initialVarieties);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [fertilizers, setFertilizers] = useState(initialFertilizers);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(1);
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);
  const [sessions, setSessions] = useState<CultivationSession[]>([]);
  const [currentSession, setCurrentSessionState] = useState<CultivationSession | null>(null);

  // Get alert operations
  const alertOps = getAlertOperations(alerts, setAlerts);
  const { addAlert, markAlertAsRead, clearAllAlerts } = alertOps;

  // Get plant operations
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
    updatePlantsInRow
  } = plantOps;

  // Get fertilizer operations
  const fertilizerOps = getFertilizerOperations(fertilizers, setFertilizers, addAlert);
  const { 
    addFertilizer, 
    updateFertilizer, 
    deleteFertilizer, 
    getFertilizerById 
  } = fertilizerOps;

  // Get variety operations
  const varietyOps = getVarietyOperations(varieties, setVarieties, spaces, setSpaces, addAlert);
  const { 
    addVariety, 
    updateVariety, 
    deleteVariety 
  } = varietyOps;

  // Get session operations
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

  // Create wrapper functions that pass the required dependencies
  const getEstimatedFloweringDate = (plantId: string) => 
    sessionOps.getEstimatedFloweringDate(plantId, getPlantById);
  
  const getEstimatedHarvestDate = (plantId: string) => 
    sessionOps.getEstimatedHarvestDate(plantId, getPlantById);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessionsData = await SessionService.getSessions();
        if (sessionsData.length > 0) {
          setSessions(sessionsData);
          
          const activeSession = sessionsData.find(s => s.isActive);
          if (activeSession) {
            setCurrentSessionState(activeSession);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sessions:", error);
        addAlert({
          type: "error",
          message: "Impossible de charger les sessions de culture depuis la base de données"
        });
      }
    };

    loadSessions();
  }, []);

  useEffect(() => {
    addAlert({
      type: "info",
      message: "Bienvenue dans votre application de gestion de culture de CBD en aéroponie"
    });
  }, []);

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
        setSelectedSpaceId,
        setSelectedPlantIds,
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
