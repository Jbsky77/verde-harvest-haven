
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

interface FinalHarvestDateProps {
  maxHarvestDate: Date | null;
  formatDateToLocale: (date: Date | null) => string;
}

export const FinalHarvestDate = ({ maxHarvestDate, formatDateToLocale }: FinalHarvestDateProps) => {
  return (
    <div className="pt-2 border-t border-green-200 flex justify-between items-center">
      <div className="flex items-center gap-1 text-green-800">
        <InfoIcon className="h-4 w-4" />
        <span className="text-sm font-medium">Fin de récolte estimée</span>
      </div>
      <Badge className="bg-green-700">
        {formatDateToLocale(maxHarvestDate)}
      </Badge>
    </div>
  );
};
