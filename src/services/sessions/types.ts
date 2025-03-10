
import { PlantVariety } from "@/types";

export type VarietyCount = {
  varietyId: string;
  count: number;
}

export type SessionWithVarieties = {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  selectedVarieties?: string[];
  varietyCounts?: VarietyCount[];
};
