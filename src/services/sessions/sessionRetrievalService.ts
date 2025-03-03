
import { supabase } from "@/integrations/supabase/client";
import { SessionWithVarieties } from "./types";

export class SessionRetrievalService {
  // Récupérer toutes les sessions
  static async getSessions(): Promise<SessionWithVarieties[]> {
    try {
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
            console.error("Erreur lors de la récupération des variétés de session:", varietiesError);
            return {
              id: session.id,
              name: session.name,
              startDate: new Date(session.start_date),
              endDate: session.end_date ? new Date(session.end_date) : null,
              isActive: session.is_active,
              selectedVarieties: []
            };
          }

          return {
            id: session.id,
            name: session.name,
            startDate: new Date(session.start_date),
            endDate: session.end_date ? new Date(session.end_date) : null,
            isActive: session.is_active,
            selectedVarieties: sessionVarieties.map(sv => sv.variety_id)
          };
        })
      );

      return sessionsWithVarieties;
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération des sessions:", error);
      return [];
    }
  }

  // Récupérer une session par ID
  static async getSessionById(sessionId: string): Promise<SessionWithVarieties | null> {
    try {
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
          selectedVarieties: []
        };
      }

      return {
        id: session.id,
        name: session.name,
        startDate: new Date(session.start_date),
        endDate: session.end_date ? new Date(session.end_date) : null,
        isActive: session.is_active,
        selectedVarieties: sessionVarieties.map(sv => sv.variety_id)
      };
    } catch (error) {
      console.error("Erreur inattendue lors de la récupération de la session:", error);
      return null;
    }
  }
}
