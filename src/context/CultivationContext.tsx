import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Plant, PlantVariety, CultivationSpace, Alert, PlantState, Fertilizer } from '@/types';

type CultivationContextType = {
  spaces: CultivationSpace[];
  varieties: PlantVariety[];
  fertilizers: Fertilizer[];
  alerts: Alert[];
  selectedSpaceId: number | null;
  selectedPlantIds: string[];
  setSelectedSpaceId: (id: number | null) => void;
  setSelectedPlantIds: (ids: string[]) => void;
  getPlantById: (id: string) => Plant | undefined;
  getSpaceById: (id: number) => CultivationSpace | undefined;
  updatePlant: (plant: Plant) => void;
  updatePlantBatch: (plants: Plant[]) => void;
  updatePlantState: (plantId: string, state: PlantState) => void;
  updatePlantsBatchState: (plantIds: string[], state: PlantState) => void;
  updatePlantEC: (plantId: string, ec: number) => void;
  updatePlantPH: (plantId: string, ph: number) => void;
  updatePlantsInSpace: (spaceId: number, updates: Partial<Plant>) => void;
  updatePlantsInRow: (spaceId: number, row: number, updates: Partial<Plant>) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
  markAlertAsRead: (id: string) => void;
  clearAllAlerts: () => void;
  addFertilizer: (fertilizer: Omit<Fertilizer, 'id' | 'createdAt' | 'color'> & { color: string }) => void;
  updateFertilizer: (fertilizer: Fertilizer) => void;
  deleteFertilizer: (id: string) => void;
  getFertilizerById: (id: string) => Fertilizer | undefined;
  addVariety: (variety: Omit<PlantVariety, 'id'>) => void;
  updateVariety: (variety: PlantVariety) => void;
  deleteVariety: (id: string) => void;
};

const CultivationContext = createContext<CultivationContextType | undefined>(undefined);

// Sample varieties
const initialVarieties: PlantVariety[] = [
  { id: "var1", name: "CBD Kush", color: "#9b87f5" },
  { id: "var2", name: "Charlotte's Web", color: "#7E69AB" },
  { id: "var3", name: "ACDC", color: "#6E59A5" },
  { id: "var4", name: "Harlequin", color: "#D6BCFA" },
  { id: "var5", name: "Cannatonic", color: "#E5DEFF" },
];

// Initial fertilizers
const initialFertilizers: Fertilizer[] = [
  { id: "fert1", name: "Nutrient de base", type: "base", unitType: "ml/L", recommendedDosage: 1.5, color: "#9b87f5" },
  { id: "fert2", name: "Nutrient de croissance", type: "growth", unitType: "ml/L", recommendedDosage: 2.0, color: "#4CAF50" },
  { id: "fert3", name: "Nutrient de floraison", type: "bloom", unitType: "ml/L", recommendedDosage: 2.5, color: "#E5BE7F" },
  { id: "fert4", name: "Booster PK", type: "booster", unitType: "ml/L", recommendedDosage: 1.0, color: "#F5A962" },
  { id: "fert5", name: "Stimulateur racinaire", type: "custom", unitType: "ml/L", recommendedDosage: 0.5, color: "#6ECFF6", isCustom: true, createdAt: new Date() },
];

// Helper function to create a plant
const createPlant = (spaceId: number, row: number, col: number, varietyId: string): Plant => {
  const variety = initialVarieties.find(v => v.id === varietyId) || initialVarieties[0];
  return {
    id: `plant-${spaceId}-${row}-${col}`,
    position: {
      space: spaceId,
      row,
      column: col
    },
    variety,
    state: "germination",
    ec: 1.2,
    ph: 6.0,
    lastUpdated: new Date()
  };
};

// Create initial spaces with plants
const generateInitialSpaces = (): CultivationSpace[] => {
  const spaces: CultivationSpace[] = [];
  
  for (let spaceId = 1; spaceId <= 6; spaceId++) {
    const plants: Plant[] = [];
    
    for (let row = 1; row <= 4; row++) {
      for (let col = 1; col <= 143; col++) {
        // Distribute varieties evenly across plants
        const varietyId = initialVarieties[Math.floor(Math.random() * initialVarieties.length)].id;
        plants.push(createPlant(spaceId, row, col, varietyId));
      }
    }
    
    spaces.push({
      id: spaceId,
      name: `Espace ${spaceId}`,
      rows: 4,
      plantsPerRow: 143,
      plants
    });
  }
  
  return spaces;
};

export const CultivationProvider = ({ children }: { children: ReactNode }) => {
  const [spaces, setSpaces] = useState<CultivationSpace[]>(generateInitialSpaces);
  const [varieties, setVarieties] = useState<PlantVariety[]>(initialVarieties);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [fertilizers, setFertilizers] = useState<Fertilizer[]>(initialFertilizers);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(1);
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);

  const getPlantById = (id: string): Plant | undefined => {
    for (const space of spaces) {
      const plant = space.plants.find(p => p.id === id);
      if (plant) return plant;
    }
    return undefined;
  };

  const getSpaceById = (id: number): CultivationSpace | undefined => {
    return spaces.find(space => space.id === id);
  };

  const updatePlant = (updatedPlant: Plant) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => {
        if (space.id === updatedPlant.position.space) {
          return {
            ...space,
            plants: space.plants.map(plant => 
              plant.id === updatedPlant.id ? updatedPlant : plant
            )
          };
        }
        return space;
      })
    );
  };

  const updatePlantBatch = (updatedPlants: Plant[]) => {
    const plantIds = new Set(updatedPlants.map(p => p.id));
    
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => {
          if (plantIds.has(plant.id)) {
            const updatedPlant = updatedPlants.find(p => p.id === plant.id);
            return updatedPlant || plant;
          }
          return plant;
        })
      }))
    );
  };

  const updatePlantState = (plantId: string, state: PlantState) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plant.id === plantId 
            ? { ...plant, state, lastUpdated: new Date() } 
            : plant
        )
      }))
    );
  };

  const updatePlantsBatchState = (plantIds: string[], state: PlantState) => {
    const plantIdSet = new Set(plantIds);
    
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plantIdSet.has(plant.id) 
            ? { ...plant, state, lastUpdated: new Date() } 
            : plant
        )
      }))
    );
  };

  const updatePlantEC = (plantId: string, ec: number) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plant.id === plantId 
            ? { ...plant, ec, lastUpdated: new Date() } 
            : plant
        )
      }))
    );

    // Create alert if EC is out of range
    if (ec < 0.8 || ec > 1.6) {
      const plant = getPlantById(plantId);
      if (plant) {
        addAlert({
          type: "warning",
          message: `EC ${ec < 0.8 ? "trop bas" : "trop élevé"} pour la plante en Espace ${plant.position.space}, Ligne ${plant.position.row}, Colonne ${plant.position.column}`,
          plantId,
          spaceId: plant.position.space
        });
      }
    }
  };

  const updatePlantPH = (plantId: string, ph: number) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plant.id === plantId 
            ? { ...plant, ph, lastUpdated: new Date() } 
            : plant
        )
      }))
    );

    // Create alert if pH is out of range
    if (ph < 5.5 || ph > 6.5) {
      const plant = getPlantById(plantId);
      if (plant) {
        addAlert({
          type: "warning",
          message: `pH ${ph < 5.5 ? "trop bas" : "trop élevé"} pour la plante en Espace ${plant.position.space}, Ligne ${plant.position.row}, Colonne ${plant.position.column}`,
          plantId,
          spaceId: plant.position.space
        });
      }
    }
  };

  const updatePlantsInSpace = (spaceId: number, updates: Partial<Plant>) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => {
        if (space.id === spaceId) {
          return {
            ...space,
            plants: space.plants.map(plant => ({
              ...plant,
              ...updates,
              lastUpdated: new Date()
            }))
          };
        }
        return space;
      })
    );
  };

  const updatePlantsInRow = (spaceId: number, row: number, updates: Partial<Plant>) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => {
        if (space.id === spaceId) {
          return {
            ...space,
            plants: space.plants.map(plant => 
              plant.position.row === row 
                ? { ...plant, ...updates, lastUpdated: new Date() } 
                : plant
            )
          };
        }
        return space;
      })
    );
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };
    
    setAlerts(prev => [newAlert, ...prev]);
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // New functions for fertilizer management
  const addFertilizer = (fertilizer: Omit<Fertilizer, 'id' | 'createdAt' | 'color'> & { color: string }) => {
    const newFertilizer: Fertilizer = {
      ...fertilizer,
      id: `fert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      isCustom: true
    };
    
    setFertilizers(prev => [...prev, newFertilizer]);
    
    addAlert({
      type: "success",
      message: `Nouvel engrais "${newFertilizer.name}" ajouté avec succès`
    });
  };

  const updateFertilizer = (updatedFertilizer: Fertilizer) => {
    setFertilizers(prev => 
      prev.map(fertilizer => 
        fertilizer.id === updatedFertilizer.id ? updatedFertilizer : fertilizer
      )
    );
    
    addAlert({
      type: "info",
      message: `Engrais "${updatedFertilizer.name}" mis à jour avec succès`
    });
  };

  const deleteFertilizer = (id: string) => {
    const fertilizer = getFertilizerById(id);
    if (fertilizer) {
      setFertilizers(prev => prev.filter(f => f.id !== id));
      
      addAlert({
        type: "info",
        message: `Engrais "${fertilizer.name}" supprimé avec succès`
      });
    }
  };

  const getFertilizerById = (id: string): Fertilizer | undefined => {
    return fertilizers.find(f => f.id === id);
  };

  // New functions for variety management
  const addVariety = (variety: Omit<PlantVariety, 'id'>) => {
    const newVariety: PlantVariety = {
      ...variety,
      id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setVarieties(prev => [...prev, newVariety]);
    
    addAlert({
      type: "success",
      message: `Nouvelle variété "${newVariety.name}" ajoutée avec succès`
    });
  };

  const updateVariety = (updatedVariety: PlantVariety) => {
    setVarieties(prev => 
      prev.map(variety => 
        variety.id === updatedVariety.id ? updatedVariety : variety
      )
    );
    
    // Update any plants that use this variety
    setSpaces(prevSpaces =>
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plant.variety.id === updatedVariety.id
            ? { ...plant, variety: updatedVariety }
            : plant
        )
      }))
    );
    
    addAlert({
      type: "info",
      message: `Variété "${updatedVariety.name}" mise à jour avec succès`
    });
  };

  const deleteVariety = (id: string) => {
    const variety = varieties.find(v => v.id === id);
    if (!variety) return;
    
    // Check if any plants are using this variety
    let isUsed = false;
    for (const space of spaces) {
      if (space.plants.some(p => p.variety.id === id)) {
        isUsed = true;
        break;
      }
    }
    
    if (isUsed) {
      addAlert({
        type: "error",
        message: `Impossible de supprimer la variété "${variety.name}" car elle est utilisée par des plantes`
      });
      return;
    }
    
    setVarieties(prev => prev.filter(v => v.id !== id));
    
    addAlert({
      type: "info",
      message: `Variété "${variety.name}" supprimée avec succès`
    });
  };

  useEffect(() => {
    // Add an initial welcome alert
    addAlert({
      type: "info",
      message: "Bienvenue dans votre application de gestion de culture de CBD en aéroponie"
    });
  }, []);

  return (
    <CultivationContext.Provider
      value={{
        spaces,
        varieties,
        fertilizers,
        alerts,
        selectedSpaceId,
        selectedPlantIds,
        setSelectedSpaceId,
        setSelectedPlantIds,
        getPlantById,
        getSpaceById,
        updatePlant,
        updatePlantBatch,
        updatePlantState,
        updatePlantsBatchState,
        updatePlantEC,
        updatePlantPH,
        updatePlantsInSpace,
        updatePlantsInRow,
        addAlert,
        markAlertAsRead,
        clearAllAlerts,
        addFertilizer,
        updateFertilizer,
        deleteFertilizer,
        getFertilizerById,
        addVariety,
        updateVariety,
        deleteVariety,
      }}
    >
      {children}
    </CultivationContext.Provider>
  );
};

export const useCultivation = () => {
  const context = useContext(CultivationContext);
  if (context === undefined) {
    throw new Error('useCultivation must be used within a CultivationProvider');
  }
  return context;
};
