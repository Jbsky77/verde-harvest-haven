
import { supabase } from "@/integrations/supabase/client";
import { PlantVariety } from "@/types";

export type SessionWithVarieties = {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  selectedVarieties?: string[];
};

export class SessionService {
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

  // Créer une nouvelle session
  static async createSession(
    name: string, 
    startDate: Date, 
    selectedVarieties?: string[]
  ): Promise<string | null> {
    try {
      // Insérer la session
      const { data: sessionData, error: sessionError } = await supabase
        .from('cultivation_sessions')
        .insert({
          name,
          start_date: startDate.toISOString(),
          is_active: true
        })
        .select('id')
        .single();

      if (sessionError || !sessionData) {
        console.error("Erreur lors de la création de la session:", sessionError);
        return null;
      }

      const sessionId = sessionData.id;

      // Si des variétés sont sélectionnées, les associer à la session
      if (selectedVarieties && selectedVarieties.length > 0) {
        const varietyInserts = selectedVarieties.map(varietyId => ({
          session_id: sessionId,
          variety_id: varietyId
        }));

        const { error: varietiesError } = await supabase
          .from('session_varieties')
          .insert(varietyInserts);

        if (varietiesError) {
          console.error("Erreur lors de l'association des variétés à la session:", varietiesError);
          // La session est quand même créée, donc on continue
        }
      }

      return sessionId;
    } catch (error) {
      console.error("Erreur inattendue lors de la création de la session:", error);
      return null;
    }
  }

  // Mettre à jour une session existante
  static async updateSession(session: SessionWithVarieties): Promise<boolean> {
    try {
      // Mettre à jour la session
      const { error: sessionError } = await supabase
        .from('cultivation_sessions')
        .update({
          name: session.name,
          start_date: session.startDate.toISOString(),
          is_active: session.isActive,
          end_date: session.endDate ? session.endDate.toISOString() : null
        })
        .eq('id', session.id);

      if (sessionError) {
        console.error("Erreur lors de la mise à jour de la session:", sessionError);
        return false;
      }

      // Supprimer les associations de variétés existantes
      const { error: deleteError } = await supabase
        .from('session_varieties')
        .delete()
        .eq('session_id', session.id);

      if (deleteError) {
        console.error("Erreur lors de la suppression des variétés existantes:", deleteError);
        return false;
      }

      // Si des variétés sont sélectionnées, les ajouter
      if (session.selectedVarieties && session.selectedVarieties.length > 0) {
        const varietyInserts = session.selectedVarieties.map(varietyId => ({
          session_id: session.id,
          variety_id: varietyId
        }));

        const { error: insertError } = await supabase
          .from('session_varieties')
          .insert(varietyInserts);

        if (insertError) {
          console.error("Erreur lors de l'ajout des nouvelles variétés:", insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Erreur inattendue lors de la mise à jour de la session:", error);
      return false;
    }
  }

  // Terminer une session
  static async endSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cultivation_sessions')
        .update({
          is_active: false,
          end_date: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error("Erreur lors de la terminaison de la session:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur inattendue lors de la terminaison de la session:", error);
      return false;
    }
  }

  // Supprimer une session
  static async deleteSession(sessionId: string): Promise<boolean> {
    try {
      // Supprimer d'abord les variétés associées
      const { error: varietiesError } = await supabase
        .from('session_varieties')
        .delete()
        .eq('session_id', sessionId);

      if (varietiesError) {
        console.error("Erreur lors de la suppression des variétés de la session:", varietiesError);
        return false;
      }

      // Supprimer la session
      const { error: sessionError } = await supabase
        .from('cultivation_sessions')
        .delete()
        .eq('id', sessionId);

      if (sessionError) {
        console.error("Erreur lors de la suppression de la session:", sessionError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur inattendue lors de la suppression de la session:", error);
      return false;
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
