
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert, Plant, PlantState, PlantVariety, RoomType, CultivationSpace } from '@/types';
import { SessionService } from '@/services/SessionService';
import { CultivationContextType, CultivationSession } from '../types';
import { generateInitialSpaces, initialFertilizers } from '../initialData';
import { getPlantOperations } from '../plantOperations';
import { getAlertOperations } from '../alertOperations';
import { getFertilizerOperations } from '../fertilizerOperations';
import { getVarietyOperations } from '../varietyOperations';
import { getSessionOperations } from '../sessionOperations';
import { 
  findPlantsNeedingStateUpdate, 
  findPlantsForFloweringTransfer 
} from '@/utils/plantStateTransitions';
import { supabase } from '@/integrations/supabase/client';
import { useCultivationPlantUpdates } from './useCultivationPlantUpdates';

const CultivationContext = createContext<CultivationContextType | undefined>(undefined);

export const CultivationProvider = ({ children }: { children: ReactNode }) => {
  const [spaces, setSpaces] = useState(generateInitialSpaces);
  const [varieties, setVarieties] = useState<PlantVariety[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [fertilizers, setFertilizers] = useState(initialFertilizers);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(1);
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);
  const [sessions, setSessions] = useState<CultivationSession[]>([]);
  const [currentSession, setCurrentSessionState] = useState<CultivationSession | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>("flowering");
  const [isLoading, setIsLoading] = useState(true);

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

  const getSpacesByRoomType = (roomType: RoomType) => {
    return spaces.filter(space => space.roomType === roomType);
  };

  // Load varieties from Supabase
  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('plant_varieties')
          .select('*');
        
        if (error) {
          console.error("Error fetching varieties:", error);
          addAlert({
            type: "error",
            message: "Erreur lors du chargement des variétés"
          });
          return;
        }
        
        if (data && data.length > 0) {
          // Transform database data to match our PlantVariety type
          const transformedVarieties: PlantVariety[] = data.map(item => ({
            id: item.id,
            name: item.name,
            color: item.color,
            germinationTime: item.germination_time,
            growthTime: item.growth_time,
            floweringTime: item.flowering_time,
            dryWeight: item.dry_weight
          }));
          
          setVarieties(transformedVarieties);
          console.log("Loaded", transformedVarieties.length, "varieties from database");
        } else {
          // If no varieties in DB, use initial ones
          console.log("No varieties found in database, using defaults");
        }
      } catch (error) {
        console.error("Error in fetchVarieties:", error);
        addAlert({
          type: "error",
          message: "Erreur lors du chargement des variétés"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVarieties();
  }, []);

  // Plant updates and management hooks
  useCultivationPlantUpdates({
    currentSession,
    spaces,
    updatePlantState,
    addAlert,
    transferPlantToFlowering,
    getSpacesByRoomType
  });

  // Initialize application data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const sessionsData = await SessionService.getSessions();
        if (sessionsData.length > 0) {
          setSessions(sessionsData);
          
          const activeSession = sessionsData.find(s => s.isActive);
          if (activeSession) {
            setCurrentSessionState(activeSession);
          }
        }
        
        addAlert({
          type: "info",
          message: "Bienvenue dans votre application de gestion de culture de CBD en aéroponie"
        });
        
      } catch (error) {
        console.error("Error initializing app:", error);
        addAlert({
          type: "error",
          message: "Erreur lors de l'initialisation de l'application"
        });
      }
    };

    initializeApp();
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
