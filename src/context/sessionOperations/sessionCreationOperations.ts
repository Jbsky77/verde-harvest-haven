
import { SessionService } from '@/services/SessionService';
import { CultivationSession } from '../types';
import { VarietyCount } from '@/services/sessions/types';

export const getSessionCreationOperations = (
  sessions: CultivationSession[],
  setSessions: React.Dispatch<React.SetStateAction<CultivationSession[]>>,
  setCurrentSessionState: React.Dispatch<React.SetStateAction<CultivationSession | null>>,
  addAlert: (alert: { type: string; message: string }) => void
) => {
  const startCultivationSession = async (
    name: string, 
    startDate: Date, 
    selectedVarieties?: string[],
    varietyCounts?: VarietyCount[]
  ): Promise<string> => {
    try {
      console.log("Creating cultivation session:", { name, startDate, selectedVarieties, varietyCounts });
      const sessionId = await SessionService.createSession(name, startDate, selectedVarieties, varietyCounts);
      
      if (!sessionId) {
        throw new Error("Aucun ID de session retourné");
      }
      
      console.log("Session created with ID:", sessionId);
      
      const newSession: CultivationSession = {
        id: sessionId,
        name,
        startDate,
        isActive: true,
        selectedVarieties,
        varietyCounts
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
        message: error instanceof Error ? error.message : "Erreur lors de la création de la session"
      });
      throw error;
    }
  };

  return {
    startCultivationSession
  };
};
