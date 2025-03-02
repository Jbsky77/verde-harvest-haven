import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Plant, PlantVariety, CultivationSpace, Alert, PlantState, Fertilizer } from '@/types';

type CultivationSession = {
  id: string;
  name: string;
  startDate: Date;
  isActive: boolean;
  endDate?: Date;
  selectedVarieties?: string[];
};

type CultivationContextType = {
  spaces: CultivationSpace[];
  varieties: PlantVariety[];
  fertilizers: Fertilizer[];
  alerts: Alert[];
  selectedSpaceId: number | null;
  selectedPlantIds: string[];
  currentSession: CultivationSession | null;
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
  startCultivationSession: (name: string, startDate: Date, selectedVarieties?: string[]) => void;
  endCultivationSession: () => void;
  getEstimatedFloweringDate: (plantId: string) => Date | null;
  getEstimatedHarvestDate: (plantId: string) => Date | null;
};

const CultivationContext = createContext<CultivationContextType | undefined>(undefined);

const initialVarieties: PlantVariety[] = [
  { id: "var1", name: "CBD Kush", color: "#9b87f5", germinationTime: 5, growthTime: 25, floweringTime: 60 },
  { id: "var2", name: "Charlotte's Web", color: "#7E69AB", germinationTime: 4, growthTime: 30, floweringTime: 65 },
  { id: "var3", name: "ACDC", color: "#6E59A5", germinationTime: 6, growthTime: 28, floweringTime: 70 },
  { id: "var4", name: "Harlequin", color: "#D6BCFA", germinationTime: 5, growthTime: 22, floweringTime: 55 },
  { id: "var5", name: "Cannatonic", color: "#E5DEFF", germinationTime: 4, growthTime: 26, floweringTime: 63 },
];

const initialFertilizers: Fertilizer[] = [
  { id: "fert1", name: "Nutrient de base", type: "base", unitType: "ml/L", recommendedDosage: 1.5, color: "#9b87f5" },
  { id: "fert2", name: "Nutrient de croissance", type: "growth", unitType: "ml/L", recommendedDosage: 2.0, color: "#4CAF50" },
  { id: "fert3", name: "Nutrient de floraison", type: "bloom", unitType: "ml/L", recommendedDosage: 2.5, color: "#E5BE7F" },
  { id: "fert4", name: "Booster PK", type: "booster", unitType: "ml/L", recommendedDosage: 1.0, color: "#F5A962" },
  { id: "fert5", name: "Stimulateur racinaire", type: "custom", unitType: "ml/L", recommendedDosage: 0.5, color: "#6ECFF6", isCustom: true, createdAt: new Date() },
];

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

const generateInitialSpaces = (): CultivationSpace[] => {
  const spaces: CultivationSpace[] = [];
  
  for (let spaceId = 1; spaceId <= 6; spaceId++) {
    const plants: Plant[] = [];
    
    for (let row = 1; row <= 4; row++) {
      for (let col = 1; col <= 143; col++) {
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
  const [currentSession, setCurrentSession] = useState<CultivationSession | null>(null);

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

  const addVariety = (variety: Omit<PlantVariety, 'id'>) => {
    const newVariety: PlantVariety = {
      ...variety,
      id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      germinationTime: variety.germinationTime ? Number(variety.germinationTime) : undefined,
      growthTime: variety.growthTime ? Number(variety.growthTime) : undefined,
      floweringTime: variety.floweringTime ? Number(variety.floweringTime) : undefined
    };
    
    setVarieties(prev => [...prev, newVariety]);
    
    addAlert({
      type: "success",
      message: `Nouvelle variété "${newVariety.name}" ajoutée avec succès`
    });
  };

  const updateVariety = (updatedVariety: PlantVariety) => {
    const varietyToUpdate = {
      ...updatedVariety,
      germinationTime: updatedVariety.germinationTime ? Number(updatedVariety.germinationTime) : undefined,
      growthTime: updatedVariety.growthTime ? Number(updatedVariety.growthTime) : undefined,
      floweringTime: updatedVariety.floweringTime ? Number(updatedVariety.floweringTime) : undefined
    };
    
    setVarieties(prev => 
      prev.map(variety => 
        variety.id === varietyToUpdate.id ? varietyToUpdate : variety
      )
    );
    
    setSpaces(prevSpaces =>
      prevSpaces.map(space => ({
        ...space,
        plants: space.plants.map(plant => 
          plant.variety.id === varietyToUpdate.id
            ? { ...plant, variety: varietyToUpdate }
            : plant
        )
      }))
    );
    
    addAlert({
      type: "info",
      message: `Variété "${varietyToUpdate.name}" mise à jour avec succès`
    });
  };

  const deleteVariety = (id: string) => {
    const variety = varieties.find(v => v.id === id);
    if (!variety) return;
    
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

  const startCultivationSession = (name: string, startDate: Date, selectedVarieties?: string[]) => {
    const newSession: CultivationSession = {
      id: `session-${Date.now()}`,
      name,
      startDate,
      isActive: true,
      selectedVarieties
    };
    
    setCurrentSession(newSession);
    
    addAlert({
      type: "success",
      message: `Nouvelle session de culture "${name}" démarrée avec succès`
    });
  };

  const endCultivationSession = () => {
    if (!currentSession) {
      addAlert({
        type: "warning",
        message: "Aucune session en cours à annuler"
      });
      return;
    }
    
    setCurrentSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        isActive: false,
        endDate: new Date()
      };
    });
    
    addAlert({
      type: "info",
      message: `Session de culture "${currentSession.name}" terminée`
    });
  };

  const getEstimatedFloweringDate = (plantId: string): Date | null => {
    if (!currentSession) return null;
    
    const plant = getPlantById(plantId);
    if (!plant) return null;
    
    const variety = plant.variety;
    if (!variety.germinationTime || !variety.growthTime) return null;
    
    const germStartDate = new Date(currentSession.startDate);
    const floweringDate = new Date(germStartDate);
    floweringDate.setDate(floweringDate.getDate() + variety.germinationTime + variety.growthTime);
    
    return floweringDate;
  };

  const getEstimatedHarvestDate = (plantId: string): Date | null => {
    if (!currentSession) return null;
    
    const plant = getPlantById(plantId);
    if (!plant) return null;
    
    const variety = plant.variety;
    if (!variety.germinationTime || !variety.growthTime || !variety.floweringTime) return null;
    
    const germStartDate = new Date(currentSession.startDate);
    const harvestDate = new Date(germStartDate);
    harvestDate.setDate(harvestDate.getDate() + variety.germinationTime + variety.growthTime + variety.floweringTime);
    
    return harvestDate;
  };

  useEffect(() => {
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
        currentSession,
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
        startCultivationSession,
        endCultivationSession,
        getEstimatedFloweringDate,
        getEstimatedHarvestDate,
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
