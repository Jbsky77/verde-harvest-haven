
import { SessionService, SessionWithVarieties } from '@/services/SessionService';
import { CultivationContextType, CultivationSession } from '../types';
import { PlantVariety } from '@/types';
import { getSessionCreationOperations } from './sessionCreationOperations';
import { getSessionRetrievalOperations } from './sessionRetrievalOperations';
import { getSessionUpdateOperations } from './sessionUpdateOperations';
import { getSessionDeletionOperations } from './sessionDeletionOperations';
import { getPlantTimingOperations } from './plantTimingOperations';

export const getSessionOperations = (
  sessions: CultivationSession[],
  setSessions: React.Dispatch<React.SetStateAction<CultivationSession[]>>,
  currentSession: CultivationSession | null,
  setCurrentSessionState: React.Dispatch<React.SetStateAction<CultivationSession | null>>,
  varieties: PlantVariety[],
  addAlert: (alert: Parameters<CultivationContextType['addAlert']>[0]) => void
) => {
  // Get session creation operations
  const { startCultivationSession } = getSessionCreationOperations(
    sessions,
    setSessions,
    setCurrentSessionState,
    addAlert
  );

  // Get session retrieval operations
  const { setCurrentSession, getSessionById } = getSessionRetrievalOperations(
    sessions,
    setSessions,
    setCurrentSessionState,
    addAlert
  );

  // Get session update operations
  const { updateSession, endCultivationSession } = getSessionUpdateOperations(
    sessions,
    setSessions,
    currentSession,
    setCurrentSessionState,
    addAlert
  );

  // Get session deletion operations
  const { deleteSession } = getSessionDeletionOperations(
    sessions,
    setSessions,
    currentSession,
    setCurrentSessionState,
    addAlert
  );

  // Get plant timing operations
  const {
    getEstimatedFloweringDate,
    getEstimatedHarvestDate,
    getEstimatedHarvestDateForVariety,
    getMaxHarvestDateForSession
  } = getPlantTimingOperations(
    currentSession,
    varieties
  );

  return {
    startCultivationSession,
    endCultivationSession,
    setCurrentSession,
    getSessionById,
    deleteSession,
    updateSession,
    getEstimatedFloweringDate,
    getEstimatedHarvestDate,
    getEstimatedHarvestDateForVariety,
    getMaxHarvestDateForSession
  };
};
