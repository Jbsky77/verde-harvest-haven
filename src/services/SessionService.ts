
import { SessionRetrievalService } from "./sessions/sessionRetrievalService";
import { SessionCreationService } from "./sessions/sessionCreationService";
import { SessionUpdateService } from "./sessions/sessionUpdateService";
import { SessionDeletionService } from "./sessions/sessionDeletionService";
import type { SessionWithVarieties, VarietyCount } from "./sessions/types";

export type { SessionWithVarieties, VarietyCount };

export class SessionService {
  // Récupérer toutes les sessions
  static async getSessions(): Promise<SessionWithVarieties[]> {
    return SessionRetrievalService.getSessions();
  }

  // Créer une nouvelle session
  static async createSession(
    name: string, 
    startDate: Date, 
    selectedVarieties?: string[],
    varietyCounts?: VarietyCount[]
  ): Promise<string> {
    return SessionCreationService.createSession(name, startDate, selectedVarieties, varietyCounts);
  }

  // Mettre à jour une session existante
  static async updateSession(session: SessionWithVarieties): Promise<boolean> {
    return SessionUpdateService.updateSession(session);
  }

  // Terminer une session
  static async endSession(sessionId: string): Promise<boolean> {
    return SessionUpdateService.endSession(sessionId);
  }

  // Supprimer une session
  static async deleteSession(sessionId: string): Promise<boolean> {
    return SessionDeletionService.deleteSession(sessionId);
  }

  // Récupérer une session par ID
  static async getSessionById(sessionId: string): Promise<SessionWithVarieties | null> {
    return SessionRetrievalService.getSessionById(sessionId);
  }
}
