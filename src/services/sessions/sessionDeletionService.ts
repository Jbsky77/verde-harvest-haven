
import { supabase } from "@/integrations/supabase/client";

export class SessionDeletionService {
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
}
