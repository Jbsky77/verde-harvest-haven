
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CultivationSession } from "@/context/types";

interface DeleteSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSession: CultivationSession;
  onConfirmDelete: () => void;
}

const DeleteSessionDialog = ({ 
  open, 
  onOpenChange, 
  currentSession, 
  onConfirmDelete 
}: DeleteSessionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Terminer la session</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir terminer la session en cours "{currentSession.name}" ?
            Cette action n'est pas réversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete}
          >
            Terminer la session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSessionDialog;
