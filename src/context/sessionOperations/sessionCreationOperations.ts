
import { SessionService } from '@/services/SessionService';
import { CultivationSession } from '../types';

export const getSessionCreationOperations = (
  sessions: CultivationSession[],
  setSessions: React.Dispatch<React.SetStateAction<CultivationSession[]>>,
  setCurrentSessionState: React.Dispatch<React.SetStateAction<CultivationSession | null>>,
  addAlert: (alert: { type: string; message: string }) => void
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

  return {
    startCultivationSession
  };
};
