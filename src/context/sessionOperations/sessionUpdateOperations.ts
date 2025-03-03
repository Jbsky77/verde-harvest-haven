
import { SessionService } from '@/services/SessionService';
import { CultivationSession } from '../types';

export const getSessionUpdateOperations = (
  sessions: CultivationSession[],
  setSessions: React.Dispatch<React.SetStateAction<CultivationSession[]>>,
  currentSession: CultivationSession | null,
  setCurrentSessionState: React.Dispatch<React.SetStateAction<CultivationSession | null>>,
  addAlert: (alert: { type: string; message: string }) => void
) => {
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

  return {
    updateSession,
    endCultivationSession
  };
};
