
import { useEffect } from 'react';
import { PlantVariety } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseFetch = (
  setVarieties: React.Dispatch<React.SetStateAction<PlantVariety[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  addAlert: (alert: { type: string; message: string }) => void
) => {
  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('plant_varieties')
          .select('*');
        
        if (error) {
          console.error("Error fetching varieties:", error);
          addAlert({
            type: "error",
            message: "Erreur lors du chargement des variétés"
          });
          return;
        }
        
        if (data && data.length > 0) {
          // Transform database data to match our PlantVariety type
          const transformedVarieties: PlantVariety[] = data.map(item => ({
            id: item.id,
            name: item.name,
            color: item.color,
            germinationTime: item.germination_time,
            growthTime: item.growth_time,
            floweringTime: item.flowering_time,
            dryWeight: item.dry_weight
          }));
          
          setVarieties(transformedVarieties);
          console.log("Loaded", transformedVarieties.length, "varieties from database");
        } else {
          // If no varieties in DB, use initial ones
          console.log("No varieties found in database, using defaults");
        }
      } catch (error) {
        console.error("Error in fetchVarieties:", error);
        addAlert({
          type: "error",
          message: "Erreur lors du chargement des variétés"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVarieties();
  }, []);
  
  return null;
};
