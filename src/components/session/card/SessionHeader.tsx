
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { CultivationSession } from "@/context/types";

interface SessionHeaderProps {
  currentSession: CultivationSession;
  formatDateToLocale: (date: Date | null) => string;
  onEdit: () => void;
  onDelete: () => void;
}

export const SessionHeader = ({ 
  currentSession, 
  formatDateToLocale, 
  onEdit, 
  onDelete 
}: SessionHeaderProps) => {
  return (
    <div className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Session en cours: {currentSession.name}
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 bg-white hover:bg-green-100"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-1" />
            Modifier
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 bg-white hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Terminer
          </Button>
        </div>
      </div>
      <CardDescription className="text-green-700">
        Démarrée le {formatDateToLocale(new Date(currentSession.startDate))}
      </CardDescription>
    </div>
  );
};
