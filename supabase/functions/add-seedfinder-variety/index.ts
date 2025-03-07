
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

// Définition des en-têtes CORS pour permettre les requêtes cross-origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration du client Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Gestionnaire de requêtes
Deno.serve(async (req) => {
  // Gérer les requêtes OPTIONS (pré-vérification CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentification requise' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Récupérer les données de la variété à ajouter
    const { variety } = await req.json();
    if (!variety || !variety.name) {
      return new Response(
        JSON.stringify({ error: 'Données de variété invalides' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Vérifier si la variété existe déjà dans la base de données
    const { data: existingVariety, error: checkError } = await supabase
      .from('seedfinder_varieties')
      .select('id')
      .eq('external_id', variety.externalId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    let savedVarietyId;

    if (existingVariety) {
      // Mettre à jour la variété existante
      console.log(`Mise à jour de la variété existante: ${variety.name}`);
      const { data, error } = await supabase
        .from('seedfinder_varieties')
        .update({
          name: variety.name,
          breeder: variety.breeder,
          genetics: variety.genetics,
          flowering_time: variety.flowering_time,
          growth_time: variety.growth_time,
          germination_time: variety.germination_time || 5,
          thc_content: variety.thc_content,
          cbd_content: variety.cbd_content,
          effects: variety.effects,
          description: variety.description,
          image_url: variety.image_url
        })
        .eq('id', existingVariety.id)
        .select('id')
        .single();

      if (error) throw error;
      savedVarietyId = data.id;
    } else {
      // Insérer une nouvelle variété
      console.log(`Insertion d'une nouvelle variété: ${variety.name}`);
      const { data, error } = await supabase
        .from('seedfinder_varieties')
        .insert({
          external_id: variety.externalId,
          name: variety.name,
          breeder: variety.breeder,
          genetics: variety.genetics,
          flowering_time: variety.flowering_time,
          growth_time: variety.growth_time,
          germination_time: variety.germination_time || 5,
          thc_content: variety.thc_content,
          cbd_content: variety.cbd_content,
          effects: variety.effects,
          description: variety.description,
          image_url: variety.image_url
        })
        .select('id')
        .single();

      if (error) throw error;
      savedVarietyId = data.id;
    }

    // Créer une variété locale à partir des données Seedfinder
    const localVariety = {
      name: variety.name,
      color: generateRandomColor(),
      germination_time: variety.germination_time || 5,
      growth_time: variety.growth_time,
      flowering_time: variety.flowering_time
    };

    // Ajouter la variété à la table des variétés de plantes
    const { data: plantVariety, error: plantVarietyError } = await supabase
      .from('plant_varieties')
      .insert(localVariety)
      .select('id')
      .single();

    if (plantVarietyError) throw plantVarietyError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        seedfinderVarietyId: savedVarietyId,
        plantVarietyId: plantVariety.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur s\'est produite' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Fonction pour générer une couleur aléatoire
function generateRandomColor(): string {
  const colors = [
    '#9b87f5', '#6FD08C', '#F58A87', '#87ACF5', '#F5D787', 
    '#D787F5', '#87F5E9', '#F5879B', '#B7F587', '#F5C287'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
