
import { Plant, PlantVariety, CultivationSpace, Alert, PlantState, Fertilizer } from '@/types';
import { SessionWithVarieties } from '@/services/SessionService';

export type CultivationSession = SessionWithVarieties;

export type CultivationContextType = {
  spaces: CultivationSpace[];
  varieties: PlantVariety[];
  fertilizers: Fertilizer[];
  alerts: Alert[];
  selectedSpaceId: number | null;
  selectedPlantIds: string[];
  sessions: CultivationSession[];
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
  startCultivationSession: (name: string, startDate: Date, selectedVarieties?: string[]) => Promise<string>;
  endCultivationSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string | null) => void;
  getSessionById: (id: string) => Promise<CultivationSession | undefined>;
  deleteSession: (id: string) => void;
  updateSession: (session: CultivationSession) => void;
  getEstimatedFloweringDate: (plantId: string) => Date | null;
  getEstimatedHarvestDate: (plantId: string) => Date | null;
  getEstimatedHarvestDateForVariety: (varietyId: string) => Date | null;
  getMaxHarvestDateForSession: (session: CultivationSession) => Date | null;
};
