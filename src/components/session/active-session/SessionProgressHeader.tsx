
import { Badge } from "@/components/ui/badge";

interface SessionProgressHeaderProps {
  progressPercent: number;
  maxHarvestDate: Date | null;
  formatDateToLocale: (date: Date | null) => string;
}

export const SessionProgressHeader = ({ 
  progressPercent, 
  maxHarvestDate, 
  formatDateToLocale 
}: SessionProgressHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-green-800">Progression globale</span>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-white text-green-800">
          {progressPercent}%
        </Badge>
        <span className="text-xs text-green-700">
          Fin estimée: {formatDateToLocale(maxHarvestDate)}
        </span>
      </div>
    </div>
  );
};
