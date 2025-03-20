
import { supabase } from "@/integrations/supabase/client";
import { SessionWithVarieties, VarietyCount } from "./types";

export class SessionRetrievalService {
  // Récupérer toutes les sessions
  static async getSessions(): Promise<SessionWithVarieties[]> {
    try {
      console.log("Retrieving all sessions");
      
      const { data: sessions, error } = await supabase
        .from('cultivation_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des sessions:", error);
        return [];
      }

      // Récupérer les variétés pour chaque session
      const sessionsWithVarieties = await Promise.all(
        sessions.map(async (session) => {
          const { data: sessionVarieties, error: varietiesError } = await supabase
            .from('session_varieties')
            .select('variety_id')
            .eq('session_id', session.id);

          if (varietiesError) {
            console.error("Erreur lors de la récupération des variétés de session:", varietiesError, "pour la session:", session.id);
            return {
              id: session.id,
              name: session.name,
              startDate: new Date(session.start_date),
              endDate: session.end_date ? new Date(session.end_date) : null,
              isActive: session.is_active,
              selectedVarieties: [],
              varietyCounts: session.variety_counts ? JSON.parse(session.variety_counts) : []
            };
          }

          return {
            id: session.id,
            name: session.name,
            startDate: new Date(session.start_date),
            endDate: session.end_date ? new Date(session.end_date) : null,
            isActive: session.is_active,
            selectedVarieties: sessionVarieties.map(sv => sv.variety_id),
            varietyCounts: session.variety_counts ? JSON.parse(session.variety_counts) : []
          };
        })
      );

      console.log(`Retrieved ${sessionsWithVarieties.length} sessions`);
      return sessionsWithVarieties;
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération des sessions:", error);
      return [];
    }
  }

  // Récupérer une session par ID
  static async getSessionById(sessionId: string): Promise<SessionWithVarieties | null> {
    try {
      console.log("Retrieving session with ID:", sessionId);
      
      const { data: session, error } = await supabase
        .from('cultivation_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error || !session) {
        console.error("Erreur lors de la récupération de la session:", error);
        return null;
      }

      // Récupérer les variétés associées
      const { data: sessionVarieties, error: varietiesError } = await supabase
        .from('session_varieties')
        .select('variety_id')
        .eq('session_id', session.id);

      if (varietiesError) {
        console.error("Erreur lors de la récupération des variétés de session:", varietiesError);
        return {
          id: session.id,
          name: session.name,
          startDate: new Date(session.start_date),
          endDate: session.end_date ? new Date(session.end_date) : null,
          isActive: session.is_active,
          selectedVarieties: [],
          varietyCounts: session.variety_counts ? JSON.parse(session.variety_counts) : []
        };
      }

      console.log("Session retrieved successfully");
      return {
        id: session.id,
        name: session.name,
        startDate: new Date(session.start_date),
        endDate: session.end_date ? new Date(session.end_date) : null,
        isActive: session.is_active,
        selectedVarieties: sessionVarieties.map(sv => sv.variety_id),
        varietyCounts: session.variety_counts ? JSON.parse(session.variety_counts) : []
      };
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération de la session:", error);
      return null;
    }
  }
}
