
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { parse } from 'https://esm.sh/node-html-parser@6.1.4';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle OPTIONS requests for CORS
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get search term from request
    const { searchTerm } = await req.json();
    if (!searchTerm) {
      return new Response(
        JSON.stringify({ error: 'Le terme de recherche est requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Searching for varieties with term: ${searchTerm}`);
    
    // Search Seedfinder
    const results = await searchSeedfinderVarieties(searchTerm);

    // Return results
    return new Response(
      JSON.stringify({ success: true, data: results }),
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

// Function to search for varieties on Seedfinder.eu
async function searchSeedfinderVarieties(searchTerm) {
  try {
    const searchUrl = `https://en.seedfinder.eu/search/database/results.php?q=${encodeURIComponent(searchTerm)}`;
    
    console.log(`Fetching search results from: ${searchUrl}`);
    
    // Fetch search results page
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CBD Cultivation App/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract search results
    const results = extractSearchResults(html);
    console.log(`Found ${results.length} varieties`);
    
    // Get details for each result (but limit to 5 to avoid timeouts)
    const limitedResults = results.slice(0, 5);
    
    const detailedResults = await Promise.all(
      limitedResults.map(async (result) => {
        if (result.externalId) {
          try {
            console.log(`Getting details for variety: ${result.name}`);
            const details = await getStrainDetails(result.externalId);
            return { ...result, ...details };
          } catch (detailError) {
            console.error(`Error getting details for ${result.externalId}:`, detailError);
            return result;
          }
        }
        return result;
      })
    );
    
    return detailedResults;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

// Extract search results from HTML
function extractSearchResults(html) {
  const root = parse(html);
  const results = [];
  
  // Select result elements
  const resultElements = root.querySelectorAll('.sortable tr');
  
  // Skip header row
  for (let i = 1; i < resultElements.length; i++) {
    const row = resultElements[i];
    const nameElement = row.querySelector('td:nth-child(1) a');
    
    if (nameElement) {
      const name = nameElement.text.trim();
      const href = nameElement.getAttribute('href');
      
      // Extract external ID from URL
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

// Get details for a specific strain
async function getStrainDetails(strainId) {
  console.log(`Getting details for variety: ${strainId}`);
  
  try {
    const url = `https://en.seedfinder.eu/database/strains/${strainId}/`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CBD Cultivation App/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const html = await response.text();
    const root = parse(html);
    
    // Extract detailed information
    let flowering = null;
    let growthTime = null;
    let genetics = '';
    let thc = '';
    let cbd = '';
    let effects = '';
    let description = '';
    let imageUrl = '';
    
    // Extract image
    const imageElement = root.querySelector('.mainimage img');
    if (imageElement) {
      const src = imageElement.getAttribute('src');
      if (src) {
        imageUrl = src.startsWith('http') ? src : `https://en.seedfinder.eu${src}`;
      }
    }
    
    // Extract description
    const descElement = root.querySelector('.straininfo');
    if (descElement) {
      description = descElement.text.trim();
    }
    
    // Extract technical information
    const infoElements = root.querySelectorAll('.techinfo tr');
    infoElements.forEach(row => {
      const label = row.querySelector('td:first-child')?.text.trim().toLowerCase();
      const value = row.querySelector('td:last-child')?.text.trim();
      
      if (label && value) {
        if (label.includes('flowering')) {
          // Extract flowering time (in days)
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
    
    // Estimate growth time if not specified (usually 3-4 weeks)
    if (!growthTime) {
      growthTime = 28; // Default: 4 weeks
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
    console.error(`Error getting details for ${strainId}:`, error);
    return {};
  }
}
