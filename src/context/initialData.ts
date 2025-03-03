
import { CultivationSpace, Plant, PlantVariety, Fertilizer } from '@/types';

export const initialVarieties: PlantVariety[] = [
  { id: "var1", name: "CBD Kush", color: "#9b87f5", germinationTime: 5, growthTime: 25, floweringTime: 60 },
  { id: "var2", name: "Charlotte's Web", color: "#7E69AB", germinationTime: 4, growthTime: 30, floweringTime: 65 },
  { id: "var3", name: "ACDC", color: "#6E59A5", germinationTime: 6, growthTime: 28, floweringTime: 70 },
  { id: "var4", name: "Harlequin", color: "#D6BCFA", germinationTime: 5, growthTime: 22, floweringTime: 55 },
  { id: "var5", name: "Cannatonic", color: "#E5DEFF", germinationTime: 4, growthTime: 26, floweringTime: 63 },
];

export const initialFertilizers: Fertilizer[] = [
  { id: "fert1", name: "Nutrient de base", type: "base", unitType: "ml/L", recommendedDosage: 1.5, color: "#9b87f5" },
  { id: "fert2", name: "Nutrient de croissance", type: "growth", unitType: "ml/L", recommendedDosage: 2.0, color: "#4CAF50" },
  { id: "fert3", name: "Nutrient de floraison", type: "bloom", unitType: "ml/L", recommendedDosage: 2.5, color: "#E5BE7F" },
  { id: "fert4", name: "Booster PK", type: "booster", unitType: "ml/L", recommendedDosage: 1.0, color: "#F5A962" },
  { id: "fert5", name: "Stimulateur racinaire", type: "custom", unitType: "ml/L", recommendedDosage: 0.5, color: "#6ECFF6", isCustom: true, createdAt: new Date() },
];

export const createPlant = (spaceId: number, row: number, col: number, varietyId: string): Plant => {
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

export const generateInitialSpaces = (): CultivationSpace[] => {
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
