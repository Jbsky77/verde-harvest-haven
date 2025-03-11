
import { useEffect } from 'react';
import { SessionService } from '@/services/SessionService';
import { CultivationSession } from '../../types';

export const useSessionInitialization = (
  setSessions: React.Dispatch<React.SetStateAction<CultivationSession[]>>,
  setCurrentSessionState: React.Dispatch<React.SetStateAction<CultivationSession | null>>,
  addAlert: (alert: { type: string; message: string }) => void
) => {
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
  
  return null;
};
