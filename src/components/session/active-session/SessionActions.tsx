
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface SessionActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const SessionActions = ({ onEdit, onDelete }: SessionActionsProps) => {
  return (
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
  );
};
