
import { PlantState } from "@/types";

export const stateColors: Record<PlantState, string> = {
  germination: "#9b87f5",
  growth: "#06b6d4",
  flowering: "#f43f5e",
  drying: "#f97316",
  harvested: "#10b981"
};

export const stateNames: Record<PlantState, string> = {
  germination: "Germination",
  growth: "Croissance",
  flowering: "Floraison",
  drying: "Séchage",
  harvested: "Récolté"
};
