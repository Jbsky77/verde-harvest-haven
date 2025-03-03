
import { SessionService } from '@/services/SessionService';
import { CultivationSession } from '../types';

export const getSessionDeletionOperations = (
  sessions: CultivationSession[],
  setSessions: React.Dispatch<React.SetStateAction<CultivationSession[]>>,
  currentSession: CultivationSession | null,
  setCurrentSessionState: React.Dispatch<React.SetStateAction<CultivationSession | null>>,
  addAlert: (alert: { type: string; message: string }) => void
) => {
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

  return {
    deleteSession
  };
};
