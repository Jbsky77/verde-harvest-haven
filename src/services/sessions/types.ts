
import { PlantVariety } from "@/types";

export type SessionWithVarieties = {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  selectedVarieties?: string[];
};
