
import { PlantState } from "@/types";

export const stateOptions: { value: PlantState; label: string }[] = [
  { value: "germination", label: "Germination" },
  { value: "growth", label: "Croissance" },
  { value: "flowering", label: "Floraison" },
  { value: "drying", label: "Séchage" },
  { value: "harvested", label: "Récolté" }
];
