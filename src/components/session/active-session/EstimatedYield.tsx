
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

interface EstimatedYieldProps {
  totalEstimatedYieldInKg: number;
}

export const EstimatedYield = ({ totalEstimatedYieldInKg }: EstimatedYieldProps) => {
  if (totalEstimatedYieldInKg <= 0) return null;
  
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-green-100 rounded-md border border-green-200">
      <div className="flex items-center gap-2">
        <InfoIcon className="h-4 w-4 text-green-700" />
        <span className="font-medium text-green-800">Récolte totale estimée</span>
      </div>
      <Badge className="bg-green-700">
        {totalEstimatedYieldInKg.toFixed(2)} kg
      </Badge>
    </div>
  );
};
