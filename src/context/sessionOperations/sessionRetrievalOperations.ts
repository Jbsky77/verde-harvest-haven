
import { SessionService } from '@/services/SessionService';
import { CultivationSession } from '../types';

export const getSessionRetrievalOperations = (
  sessions: CultivationSession[],
  setSessions: React.Dispatch<React.SetStateAction<CultivationSession[]>>,
  setCurrentSessionState: React.Dispatch<React.SetStateAction<CultivationSession | null>>,
  addAlert: (alert: { type: string; message: string }) => void
) => {
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

  return {
    setCurrentSession,
    getSessionById
  };
};
