
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supabase client setup
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Request handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get variety data from request
    const { variety } = await req.json();
    if (!variety || !variety.name) {
      return new Response(
        JSON.stringify({ error: 'Données de variété invalides' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Processing variety: ${variety.name}`);

    // Check if variety already exists
    const { data: existingVariety, error: checkError } = await supabase
      .from('seedfinder_varieties')
      .select('id')
      .eq('external_id', variety.externalId)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    let seedfinderVarietyId;

    if (existingVariety) {
      // Update existing variety
      console.log(`Updating existing variety: ${variety.name}`);
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
      seedfinderVarietyId = data.id;
    } else {
      // Insert new variety
      console.log(`Inserting new variety: ${variety.name}`);
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
      seedfinderVarietyId = data.id;
    }

    // Create a local variety from Seedfinder data
    const localVariety = {
      name: variety.name,
      color: generateRandomColor(),
      germination_time: variety.germination_time || 5,
      growth_time: variety.growth_time,
      flowering_time: variety.flowering_time
    };

    // Add variety to plant_varieties table
    const { data: plantVariety, error: plantVarietyError } = await supabase
      .from('plant_varieties')
      .insert(localVariety)
      .select('id')
      .single();

    if (plantVarietyError) throw plantVarietyError;

    console.log(`Successfully added variety: ${variety.name} with ID: ${plantVariety.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        seedfinderVarietyId,
        plantVarietyId: plantVariety.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur s\'est produite' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Generate a random color for variety
function generateRandomColor() {
  const colors = [
    '#9b87f5', '#6FD08C', '#F58A87', '#87ACF5', '#F5D787', 
    '#D787F5', '#87F5E9', '#F5879B', '#B7F587', '#F5C287'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
