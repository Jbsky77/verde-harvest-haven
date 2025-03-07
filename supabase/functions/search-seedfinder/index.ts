
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { parse } from 'https://esm.sh/node-html-parser@6.1.4';

// Définition des en-têtes CORS pour permettre les requêtes cross-origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gestionnaire de requêtes
Deno.serve(async (req) => {
  // Gérer les requêtes OPTIONS (pré-vérification CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupérer et valider les paramètres de la requête
    const { searchTerm } = await req.json();
    if (!searchTerm) {
      return new Response(
        JSON.stringify({ error: 'Le terme de recherche est requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Récupérer les données depuis Seedfinder.eu
    const results = await searchSeedfinderVarieties(searchTerm);

    // Retourner les résultats
    return new Response(
      JSON.stringify({ success: true, data: results }),
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

// Fonction pour rechercher des variétés sur Seedfinder.eu
async function searchSeedfinderVarieties(searchTerm: string) {
  console.log(`Recherche de variétés pour: ${searchTerm}`);
  
  try {
    // Construction de l'URL de recherche
    const searchUrl = `https://en.seedfinder.eu/search/database/results.php?q=${encodeURIComponent(searchTerm)}`;
    
    // Récupération de la page de résultats
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CBD Cultivation App/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extraction des résultats de recherche
    const results = extractSearchResults(html);
    console.log(`${results.length} variétés trouvées`);
    
    // Pour chaque résultat, récupérer les détails si l'ID est disponible
    const detailedResults = await Promise.all(
      results.map(async (result) => {
        if (result.externalId) {
          const details = await getStrainDetails(result.externalId);
          return { ...result, ...details };
        }
        return result;
      })
    );
    
    return detailedResults;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    throw error;
  }
}

// Fonction pour extraire les résultats de recherche du HTML
function extractSearchResults(html: string) {
  const root = parse(html);
  const results = [];
  
  // Sélectionner les éléments de résultat dans le HTML
  const resultElements = root.querySelectorAll('.sortable tr');
  
  // Ignorer l'en-tête du tableau
  for (let i = 1; i < resultElements.length; i++) {
    const row = resultElements[i];
    const nameElement = row.querySelector('td:nth-child(1) a');
    
    if (nameElement) {
      const name = nameElement.text.trim();
      const href = nameElement.getAttribute('href');
      
      // Extraire l'ID externe de l'URL
      let externalId = null;
      if (href) {
        const match = href.match(/\/database\/strains\/([^\/]+)\//);
        if (match) {
          externalId = match[1];
        }
      }
      
      const breederElement = row.querySelector('td:nth-child(2)');
      const breeder = breederElement ? breederElement.text.trim() : '';
      
      results.push({
        name,
        breeder,
        externalId,
        seedfinderUrl: href ? `https://en.seedfinder.eu${href}` : null
      });
    }
  }
  
  return results;
}

// Fonction pour obtenir les détails d'une variété spécifique
async function getStrainDetails(strainId: string) {
  console.log(`Récupération des détails pour la variété: ${strainId}`);
  
  try {
    const url = `https://en.seedfinder.eu/database/strains/${strainId}/`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CBD Cultivation App/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const html = await response.text();
    const root = parse(html);
    
    // Extraction des informations détaillées
    let flowering = null;
    let growthTime = null;
    let genetics = '';
    let thc = '';
    let cbd = '';
    let effects = '';
    let description = '';
    let imageUrl = '';
    
    // Extraction de l'image
    const imageElement = root.querySelector('.mainimage img');
    if (imageElement) {
      const src = imageElement.getAttribute('src');
      if (src) {
        imageUrl = src.startsWith('http') ? src : `https://en.seedfinder.eu${src}`;
      }
    }
    
    // Extraction de la description
    const descElement = root.querySelector('.straininfo');
    if (descElement) {
      description = descElement.text.trim();
    }
    
    // Extraction des informations techniques
    const infoElements = root.querySelectorAll('.techinfo tr');
    infoElements.forEach(row => {
      const label = row.querySelector('td:first-child')?.text.trim().toLowerCase();
      const value = row.querySelector('td:last-child')?.text.trim();
      
      if (label && value) {
        if (label.includes('flowering')) {
          // Extraction du temps de floraison (en jours)
          const match = value.match(/(\d+)/);
          if (match) {
            flowering = parseInt(match[1], 10);
          }
        } else if (label.includes('genetics')) {
          genetics = value;
        } else if (label.includes('thc')) {
          thc = value;
        } else if (label.includes('cbd')) {
          cbd = value;
        } else if (label.includes('effect')) {
          effects = value;
        }
      }
    });
    
    // Estimation du temps de croissance si non spécifié (généralement 3-4 semaines)
    if (!growthTime) {
      growthTime = 28; // Valeur par défaut de 4 semaines
    }
    
    return {
      flowering_time: flowering,
      growth_time: growthTime,
      genetics,
      thc_content: thc,
      cbd_content: cbd,
      effects,
      description,
      image_url: imageUrl
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails pour ${strainId}:`, error);
    return {};
  }
}
