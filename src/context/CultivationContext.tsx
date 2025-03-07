
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert, Plant, PlantState, PlantVariety, RoomType, CultivationSpace } from '@/types';
import { SessionService } from '@/services/SessionService';
import { CultivationContextType, CultivationSession } from './types';
import { generateInitialSpaces, initialVarieties, initialFertilizers } from './initialData';
import { getPlantOperations } from './plantOperations';
import { getAlertOperations } from './alertOperations';
import { getFertilizerOperations } from './fertilizerOperations';
import { getVarietyOperations } from './varietyOperations';
import { getSessionOperations } from './sessionOperations';
import { 
  findPlantsNeedingStateUpdate, 
  findPlantsForFloweringTransfer 
} from '@/utils/plantStateTransitions';

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
    transferPlantToFlowering
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

  const getSpacesByRoomType = (roomType: RoomType) => {
    return spaces.filter(space => space.roomType === roomType);
  };

  const checkAndUpdatePlantStates = () => {
    if (!currentSession || !currentSession.isActive) return;
    
    const allPlants = spaces.flatMap(space => space.plants);
    
    const plantsNeedingUpdate = findPlantsNeedingStateUpdate(allPlants, currentSession, spaces);
    
    if (plantsNeedingUpdate.length > 0) {
      plantsNeedingUpdate.forEach(({ plant, newState }) => {
        updatePlantState(plant.id, newState);
        
        addAlert({
          type: "info",
          message: `${plant.variety.name} en Espace ${plant.position.space}, L${plant.position.row}-C${plant.position.column} est passée à l'état: ${newState}`,
          plantId: plant.id,
          spaceId: plant.position.space
        });
      });
    }
  };

  const checkAndTransferPlants = () => {
    if (!currentSession || !currentSession.isActive) return;
    
    const plantsForTransfer = findPlantsForFloweringTransfer(spaces, currentSession);
    
    if (plantsForTransfer.length > 0) {
      plantsForTransfer.forEach(plant => {
        const floweringSpaces = getSpacesByRoomType("flowering");
        if (floweringSpaces.length === 0) return;
        
        const targetSpace = floweringSpaces[0];
        
        transferPlantToFlowering(plant.id, targetSpace.id);
        
        addAlert({
          type: "success",
          message: `${plant.variety.name} transférée de l'Espace ${plant.position.space} (Croissance) vers l'Espace ${targetSpace.id} (Floraison)`,
          plantId: plant.id,
          spaceId: targetSpace.id
        });
      });
    }
  };

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

  useEffect(() => {
    checkAndUpdatePlantStates();
    checkAndTransferPlants();
    
    const intervalId = setInterval(() => {
      checkAndUpdatePlantStates();
      checkAndTransferPlants();
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
        transferPlantToFlowering,
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
