
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert, Plant, PlantState, PlantVariety, RoomType } from '@/types';
import { SessionService } from '@/services/SessionService';
import { CultivationContextType, CultivationSession } from './types';
import { generateInitialSpaces, initialVarieties, initialFertilizers } from './initialData';
import { getPlantOperations } from './plantOperations';
import { getAlertOperations } from './alertOperations';
import { getFertilizerOperations } from './fertilizerOperations';
import { getVarietyOperations } from './varietyOperations';
import { getSessionOperations } from './sessionOperations';
import { findPlantsNeedingStateUpdate } from '@/utils/plantStateTransitions';

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
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>("flowering");

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

  // Get spaces by room type
  const getSpacesByRoomType = (roomType: RoomType) => {
    return spaces.filter(space => space.roomType === roomType);
  };

  // Automatic plant state transitions
  const checkAndUpdatePlantStates = () => {
    if (!currentSession || !currentSession.isActive) return;
    
    // Collect all plants
    const allPlants = spaces.flatMap(space => space.plants);
    
    // Find plants that need updates
    const plantsNeedingUpdate = findPlantsNeedingStateUpdate(allPlants, currentSession);
    
    // Update plant states if needed
    if (plantsNeedingUpdate.length > 0) {
      plantsNeedingUpdate.forEach(({ plant, newState }) => {
        updatePlantState(plant.id, newState);
        
        // Add alert for state change
        addAlert({
          type: "info",
          message: `${plant.variety.name} en Espace ${plant.position.space}, L${plant.position.row}-C${plant.position.column} est passée à l'état: ${newState}`,
          plantId: plant.id,
          spaceId: plant.position.space
        });
      });
    }
  };

  // Load sessions on initialization
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

  // Initial welcome alert
  useEffect(() => {
    addAlert({
      type: "info",
      message: "Bienvenue dans votre application de gestion de culture de CBD en aéroponie"
    });
  }, []);

  // Check plant states every hour and on session/spaces changes
  useEffect(() => {
    // Check immediately on load
    checkAndUpdatePlantStates();
    
    // Set up interval for periodic checks (every hour)
    const intervalId = setInterval(() => {
      checkAndUpdatePlantStates();
    }, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [currentSession, spaces]);

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
