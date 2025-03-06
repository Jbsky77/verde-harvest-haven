
import { supabase } from "@/integrations/supabase/client";

export class SessionCreationService {
  // Créer une nouvelle session
  static async createSession(
    name: string, 
    startDate: Date, 
    selectedVarieties?: string[]
  ): Promise<string> {
    try {
      console.log("Creating new session:", { name, startDate, selectedVarieties });
      
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

      if (sessionError) {
        console.error("Erreur lors de la création de la session:", sessionError);
        throw new Error(`Erreur lors de la création de la session: ${sessionError.message}`);
      }

      if (!sessionData || !sessionData.id) {
        console.error("Aucune donnée retournée lors de la création de la session");
        throw new Error("Erreur lors de la création de la session: aucune donnée retournée");
      }

      const sessionId = sessionData.id;
      console.log("Session created with ID:", sessionId);

      // Si des variétés sont sélectionnées, les associer à la session
      if (selectedVarieties && selectedVarieties.length > 0) {
        console.log("Associating varieties to session:", selectedVarieties);
        const varietyInserts = selectedVarieties.map(varietyId => ({
          session_id: sessionId,
          variety_id: varietyId
        }));

        const { error: varietiesError } = await supabase
          .from('session_varieties')
          .insert(varietyInserts);

        if (varietiesError) {
          console.error("Erreur lors de l'association des variétés à la session:", varietiesError);
          // On continue quand même, la session est créée
        }
      }

      return sessionId;
    } catch (error) {
      console.error("Erreur inattendue lors de la création de la session:", error);
      throw error;
    }
  }
}
