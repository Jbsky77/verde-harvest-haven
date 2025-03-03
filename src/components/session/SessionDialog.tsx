
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X } from "lucide-react";
import { useCultivation } from "@/context/CultivationContext";
import { useToast } from "@/hooks/use-toast";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing?: boolean;
  currentSession?: {
    id: string;
    name: string;
    startDate: Date;
    selectedVarieties?: string[];
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
  const [sessionName, setSessionName] = useState("");
  const [sessionDateText, setSessionDateText] = useState("");
  const { 
    startCultivationSession, 
    updateSession,
    varieties, 
    endCultivationSession, 
    setCurrentSession 
  } = useCultivation();
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize form with current session data if editing
  useEffect(() => {
    if (isEditing && currentSession) {
      setSessionName(currentSession.name);
      
      // Format the date to DD/MM/YYYY
      const date = new Date(currentSession.startDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setSessionDateText(`${day}/${month}/${year}`);
      
      setSelectedVarieties(currentSession.selectedVarieties || []);
    }
  }, [isEditing, currentSession, open]);

  const handleSaveSession = async () => {
    if (sessionName.trim() && sessionDateText && selectedVarieties.length > 0) {
      // Parse the date from the French format (DD/MM/YYYY)
      const [day, month, year] = sessionDateText.split('/').map(num => parseInt(num, 10));
      
      // JavaScript months are 0-indexed
      const sessionStartDate = new Date(year, month - 1, day);
      
      // Check if this is a valid date
      if (isNaN(sessionStartDate.getTime())) {
        setDateError("Format de date invalide. Utilisez JJ/MM/AAAA");
        return;
      }
      
      if (isEditing && currentSession) {
        // Pour l'édition, mettre à jour la session existante
        updateSession({
          id: currentSession.id,
          name: sessionName,
          startDate: sessionStartDate,
          isActive: true,
          selectedVarieties
        });
        
        toast({
          title: "Session modifiée",
          description: `La session "${sessionName}" a été mise à jour avec succès.`,
          variant: "default",
        });
      } else {
        // Pour une nouvelle session
        try {
          const sessionId = await startCultivationSession(sessionName, sessionStartDate, selectedVarieties);
          
          toast({
            title: "Session créée",
            description: `La session "${sessionName}" a été créée avec succès.`,
            variant: "default",
          });
          
          // Callback pour informer le parent de la création de la session
          if (onSessionCreated && sessionId) {
            onSessionCreated(sessionId);
          }
        } catch (error) {
          console.error("Erreur lors de la création de la session:", error);
          toast({
            title: "Erreur",
            description: "Une erreur s'est produite lors de la création de la session.",
            variant: "destructive",
          });
        }
      }
      
      onOpenChange(false);
      resetForm();
    }
  };

  const resetForm = () => {
    // Only reset if not editing or dialog is closing
    if (!isEditing || !open) {
      setSessionName("");
      setSessionDateText("");
      setSelectedVarieties([]);
      setDateError(null);
    }
  };

  const handleCheckVariety = (varietyId: string, checked: boolean) => {
    if (checked) {
      setSelectedVarieties(prev => [...prev, varietyId]);
    } else {
      setSelectedVarieties(prev => prev.filter(id => id !== varietyId));
    }
  };

  const selectAllVarieties = () => {
    setSelectedVarieties(varieties.map(v => v.id));
  };

  const deselectAllVarieties = () => {
    setSelectedVarieties([]);
  };

  const handleDateChange = (value: string) => {
    setSessionDateText(value);
    setDateError(null);
  };

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
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="session-name">Nom de la session</Label>
              <Input
                id="session-name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Saison été 2023"
              />
            </div>
            <div>
              <Label htmlFor="session-date">Date de début</Label>
              <Input
                id="session-date"
                value={sessionDateText}
                onChange={(e) => handleDateChange(e.target.value)}
                placeholder="JJ/MM/AAAA"
              />
              {dateError && (
                <p className="text-sm text-red-500 mt-1">{dateError}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Entrez la date de début au format JJ/MM/AAAA (exemple: 15/04/2023)
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Sélectionner les variétés</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={selectAllVarieties}
                    className="h-8 text-xs"
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Tout sélectionner
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={deselectAllVarieties}
                    className="h-8 text-xs"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Tout désélectionner
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-44 border rounded-md p-2">
                <div className="space-y-2">
                  {varieties.map((variety) => (
                    <div key={variety.id} className="flex items-center gap-2">
                      <Checkbox 
                        id={`variety-${variety.id}`}
                        checked={selectedVarieties.includes(variety.id)}
                        onCheckedChange={(checked) => handleCheckVariety(variety.id, checked === true)}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: variety.color }}
                      />
                      <Label 
                        htmlFor={`variety-${variety.id}`} 
                        className="flex-grow cursor-pointer text-sm"
                      >
                        {variety.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedVarieties.length} variété(s) sélectionnée(s) sur {varieties.length}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            variant={isEditing ? "default" : "success"}
            onClick={handleSaveSession} 
            disabled={!sessionName.trim() || !sessionDateText || selectedVarieties.length === 0}
          >
            {isEditing ? "Enregistrer les modifications" : "Créer la session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDialog;
