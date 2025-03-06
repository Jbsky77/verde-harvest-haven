
import { supabase } from "@/integrations/supabase/client";
import { SessionWithVarieties } from "./types";

export class SessionUpdateService {
  // Mettre à jour une session existante
  static async updateSession(session: SessionWithVarieties): Promise<boolean> {
    try {
      console.log("Updating session:", session);
      
      // Mettre à jour la session
      const { error: sessionError } = await supabase
        .from('cultivation_sessions')
        .update({
          name: session.name,
          start_date: new Date(session.startDate).toISOString(),
          is_active: session.isActive,
          end_date: session.endDate ? new Date(session.endDate).toISOString() : null
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

      console.log("Session successfully updated");
      return true;
    } catch (error) {
      console.error("Erreur inattendue lors de la mise à jour de la session:", error);
      return false;
    }
  }

  // Terminer une session
  static async endSession(sessionId: string): Promise<boolean> {
    try {
      console.log("Ending session with ID:", sessionId);
      
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

      console.log("Session successfully ended");
      return true;
    } catch (error) {
      console.error("Erreur inattendue lors de la terminaison de la session:", error);
      return false;
    }
  }
}
