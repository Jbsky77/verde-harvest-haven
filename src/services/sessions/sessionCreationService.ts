
import { supabase } from "@/integrations/supabase/client";

export class SessionCreationService {
  // Créer une nouvelle session
  static async createSession(
    name: string, 
    startDate: Date, 
    selectedVarieties?: string[]
  ): Promise<string> {
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
        throw new Error("Erreur lors de la création de la session");
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
      throw error;
    }
  }
}
