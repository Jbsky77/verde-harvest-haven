
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SessionDialogForm } from "./dialog";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing?: boolean;
  currentSession?: {
    id: string;
    name: string;
    startDate: Date;
    selectedVarieties?: string[];
    varietyCounts?: any[];
  } | null;
  onSessionCreated?: (sessionId: string) => void;
}

const SessionDialog = ({ 
  open, 
  onOpenChange, 
  isEditing = false, 
  currentSession = null,
  onSessionCreated 
}: SessionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing 
              ? `Modifier la session "${currentSession?.name}"`
              : "Créer une nouvelle session de culture"}
          </DialogTitle>
        </DialogHeader>
        
        <SessionDialogForm
          isEditing={isEditing}
          currentSession={currentSession}
          onOpenChange={onOpenChange}
          onSessionCreated={onSessionCreated}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SessionDialog;
