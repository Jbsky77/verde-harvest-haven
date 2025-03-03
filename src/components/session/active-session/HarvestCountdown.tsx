
import { Timer } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface HarvestCountdownProps {
  daysRemaining: number;
  formatDateToLocale: (date: Date | null) => string;
  maxHarvestDate: Date | null;
}

export const HarvestCountdown = ({
  daysRemaining,
  formatDateToLocale,
  maxHarvestDate
}: HarvestCountdownProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
      <div className="flex items-center justify-center gap-2">
        <Timer className="h-5 w-5 text-green-700" />
        <span className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-green-800`}>
          {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} avant récolte
        </span>
      </div>
      <div className="text-center text-xs text-green-600 mt-1">
        Date estimée: {formatDateToLocale(maxHarvestDate)}
      </div>
    </div>
  );
};
