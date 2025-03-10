
export type PlantVariety = {
  id: string;
  name: string;
  color: string;
  germinationTime?: number; // en jours
  growthTime?: number; // en jours
  floweringTime?: number; // en jours
  dryWeight?: number; // poids sec par plant en grammes
};

export type PlantState = 
  | "germination" 
  | "growth" 
  | "flowering" 
  | "drying" 
  | "harvested";

export type Plant = {
  id: string;
  position: {
    space: number;
    row: number;
    column: number;
  };
  variety: PlantVariety;
  state: PlantState;
  ec: number;
  ph: number;
  lastUpdated: Date;
  notes?: string;
};

export type FertilizerType = "base" | "growth" | "bloom" | "booster" | "custom";

export type Fertilizer = {
  id: string;
  name: string;
  type: FertilizerType;
  unitType: "ml/L" | "g/L";
  recommendedDosage: number;
  color?: string;
  createdAt?: Date;
  isCustom?: boolean;
};

export type RoomType = "flowering" | "growth";

export type CultivationSpace = {
  id: number;
  name: string;
  rows: number;
  plantsPerRow: number;
  plants: Plant[];
  roomType: RoomType;
};

export type Alert = {
  id: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: Date;
  read: boolean;
  spaceId?: number;
  plantId?: string;
};
