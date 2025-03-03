
import { SessionService } from '@/services/SessionService';
import { CultivationSession } from '../types';
import { toast } from '@/hooks/use-toast';

export const getSessionCreationOperations = (
  sessions: CultivationSession[],
  setSessions: React.Dispatch<React.SetStateAction<CultivationSession[]>>,
  setCurrentSessionState: React.Dispatch<React.SetStateAction<CultivationSession | null>>,
  addAlert: (alert: { type: string; message: string }) => void
) => {
  const startCultivationSession = async (name: string, startDate: Date, selectedVarieties?: string[]): Promise<string> => {
    try {
      console.log("Creating cultivation session:", { name, startDate, selectedVarieties });
      const sessionId = await SessionService.createSession(name, startDate, selectedVarieties);
      
      if (!sessionId) {
        throw new Error("Aucun ID de session retourné");
      }
      
      console.log("Session created with ID:", sessionId);
      
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
      
      // Show toast notification in addition to adding an alert
      toast({
        title: "Session créée",
        description: `Nouvelle session de culture "${name}" créée avec succès`,
        variant: "default",
      });
      
      addAlert({
        type: "success",
        message: `Nouvelle session de culture "${name}" créée avec succès`
      });

      return sessionId;
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      
      // Show toast notification for the error
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création de la session",
        variant: "destructive",
      });
      
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
