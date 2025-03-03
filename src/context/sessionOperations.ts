
import { SessionService, SessionWithVarieties } from '@/services/SessionService';
import { CultivationContextType, CultivationSession } from './types';
import { PlantVariety } from '@/types';

export const getSessionOperations = (
  sessions: CultivationSession[],
  setSessions: React.Dispatch<React.SetStateAction<CultivationSession[]>>,
  currentSession: CultivationSession | null,
  setCurrentSessionState: React.Dispatch<React.SetStateAction<CultivationSession | null>>,
  varieties: PlantVariety[],
  addAlert: (alert: Parameters<CultivationContextType['addAlert']>[0]) => void
) => {
  const startCultivationSession = async (name: string, startDate: Date, selectedVarieties?: string[]): Promise<string> => {
    try {
      const sessionId = await SessionService.createSession(name, startDate, selectedVarieties);
      
      const newSession: CultivationSession = {
        id: sessionId,
        name,
        startDate,
        isActive: true,
        selectedVarieties
      };
      
      setSessions(prev => [...prev, newSession]);
      
      if (sessions.length === 0) {
        setCurrentSessionState(newSession);
      }
      
      addAlert({
        type: "success",
        message: `Nouvelle session de culture "${name}" créée avec succès`
      });

      return sessionId;
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      addAlert({
        type: "error",
        message: "Erreur lors de la création de la session"
      });
      throw error;
    }
  };

  const setCurrentSession = async (sessionId: string | null) => {
    if (sessionId === null) {
      setCurrentSessionState(null);
      return;
    }
    
    try {
      const localSession = sessions.find(s => s.id === sessionId);
      if (localSession) {
        setCurrentSessionState(localSession);
        addAlert({
          type: "info",
          message: `Session active: "${localSession.name}"`
        });
        return;
      }
      
      const session = await SessionService.getSessionById(sessionId);
      if (session) {
        setCurrentSessionState(session);
        setSessions(prev => {
          if (!prev.some(s => s.id === session.id)) {
            return [...prev, session];
          }
          return prev;
        });
        
        addAlert({
          type: "info",
          message: `Session active: "${session.name}"`
        });
      } else {
        addAlert({
          type: "warning",
          message: `Session avec l'ID ${sessionId} non trouvée`
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la session:", error);
      addAlert({
        type: "error",
        message: "Erreur lors de la définition de la session active"
      });
    }
  };

  const getSessionById = async (id: string): Promise<CultivationSession | undefined> => {
    const localSession = sessions.find(s => s.id === id);
    if (localSession) {
      return localSession;
    }
    
    try {
      const session = await SessionService.getSessionById(id);
      if (session) {
        setSessions(prev => {
          if (!prev.some(s => s.id === session.id)) {
            return [...prev, session];
          }
          return prev;
        });
        return session;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la session:", error);
    }
    
    return undefined;
  };

  const updateSession = async (updatedSession: CultivationSession) => {
    try {
      const success = await SessionService.updateSession(updatedSession);
      
      if (!success) {
        addAlert({
          type: "error",
          message: "Erreur lors de la mise à jour de la session dans la base de données"
        });
        return;
      }
      
      setSessions(prev => prev.map(s => 
        s.id === updatedSession.id ? updatedSession : s
      ));
      
      if (currentSession && currentSession.id === updatedSession.id) {
        setCurrentSessionState(updatedSession);
      }
      
      addAlert({
        type: "info",
        message: `Session "${updatedSession.name}" mise à jour avec succès`
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la session:", error);
      addAlert({
        type: "error",
        message: "Erreur lors de la mise à jour de la session"
      });
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const sessionToDelete = sessions.find(s => s.id === id);
      if (!sessionToDelete) {
        addAlert({
          type: "warning",
          message: "Session non trouvée"
        });
        return;
      }
      
      const success = await SessionService.deleteSession(id);
      
      if (!success) {
        addAlert({
          type: "error",
          message: "Erreur lors de la suppression de la session dans la base de données"
        });
        return;
      }
      
      setSessions(prev => prev.filter(s => s.id !== id));
      
      if (currentSession && currentSession.id === id) {
        const firstActiveSession = sessions.find(s => s.id !== id && s.isActive);
        setCurrentSessionState(firstActiveSession || null);
      }
      
      addAlert({
        type: "info",
        message: `Session "${sessionToDelete.name}" supprimée avec succès`
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la session:", error);
      addAlert({
        type: "error",
        message: "Erreur lors de la suppression de la session"
      });
    }
  };

  const endCultivationSession = async (sessionId: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) {
        addAlert({
          type: "warning",
          message: "Session non trouvée"
        });
        return;
      }
      
      if (!session.isActive) {
        addAlert({
          type: "warning",
          message: `La session "${session.name}" est déjà terminée`
        });
        return;
      }
      
      const success = await SessionService.endSession(sessionId);
      
      if (!success) {
        addAlert({
          type: "error",
          message: "Erreur lors de la terminaison de la session dans la base de données"
        });
        return;
      }
      
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, isActive: false, endDate: new Date() } : s
      ));
      
      if (currentSession && currentSession.id === sessionId) {
        setCurrentSessionState(prev => {
          if (!prev) return null;
          return { ...prev, isActive: false, endDate: new Date() };
        });
      }
      
      addAlert({
        type: "info",
        message: `Session de culture "${session.name}" terminée`
      });
    } catch (error) {
      console.error("Erreur lors de la terminaison de la session:", error);
      addAlert({
        type: "error",
        message: "Erreur lors de la terminaison de la session"
      });
    }
  };

  const getEstimatedFloweringDate = (plantId: string, getPlantById: (id: string) => any): Date | null => {
    if (!currentSession) return null;
    
    const plant = getPlantById(plantId);
    if (!plant) return null;
    
    const variety = plant.variety;
    if (!variety.germinationTime || !variety.growthTime) return null;
    
    const germStartDate = new Date(currentSession.startDate);
    const floweringDate = new Date(germStartDate);
    floweringDate.setDate(floweringDate.getDate() + variety.germinationTime + variety.growthTime);
    
    return floweringDate;
  };

  const getEstimatedHarvestDate = (plantId: string, getPlantById: (id: string) => any): Date | null => {
    if (!currentSession) return null;
    
    const plant = getPlantById(plantId);
    if (!plant) return null;
    
    const variety = plant.variety;
    if (!variety.germinationTime || !variety.growthTime || !variety.floweringTime) return null;
    
    const germStartDate = new Date(currentSession.startDate);
    const harvestDate = new Date(germStartDate);
    harvestDate.setDate(harvestDate.getDate() + variety.germinationTime + variety.growthTime + variety.floweringTime);
    
    return harvestDate;
  };

  const getEstimatedHarvestDateForVariety = (varietyId: string): Date | null => {
    if (!currentSession) return null;
    
    const variety = varieties.find(v => v.id === varietyId);
    if (!variety || !variety.germinationTime || !variety.growthTime || !variety.floweringTime) return null;
    
    const germStartDate = new Date(currentSession.startDate);
    const harvestDate = new Date(germStartDate);
    harvestDate.setDate(harvestDate.getDate() + variety.germinationTime + variety.growthTime + variety.floweringTime);
    
    return harvestDate;
  };

  const getMaxHarvestDateForSession = (session: CultivationSession): Date | null => {
    if (!session.selectedVarieties || session.selectedVarieties.length === 0) return null;
    
    let maxDate: Date | null = null;
    
    for (const varietyId of session.selectedVarieties) {
      const variety = varieties.find(v => v.id === varietyId);
      if (!variety || !variety.germinationTime || !variety.growthTime || !variety.floweringTime) continue;
      
      const germStartDate = new Date(session.startDate);
      const harvestDate = new Date(germStartDate);
      harvestDate.setDate(harvestDate.getDate() + variety.germinationTime + variety.growthTime + variety.floweringTime);
      
      if (!maxDate || harvestDate > maxDate) {
        maxDate = harvestDate;
      }
    }
    
    return maxDate;
  };

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
