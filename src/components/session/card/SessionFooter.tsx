
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";
import { CultivationSession } from "@/context/types";

interface SessionFooterProps {
  currentSession: CultivationSession;
  getMaxHarvestDateForSession: (session: CultivationSession) => Date | null;
  formatDateToLocale: (date: Date | null) => string;
}

export const SessionFooter = ({ 
  currentSession, 
  getMaxHarvestDateForSession, 
  formatDateToLocale 
}: SessionFooterProps) => {
  return (
    <div className="pt-2 border-t border-green-200 flex justify-between items-center">
      <div className="flex items-center gap-1 text-green-800">
        <InfoIcon className="h-4 w-4" />
        <span className="text-sm font-medium">Fin de récolte estimée</span>
      </div>
      <Badge className="bg-green-700">
        {formatDateToLocale(getMaxHarvestDateForSession(currentSession))}
      </Badge>
    </div>
  );
};
