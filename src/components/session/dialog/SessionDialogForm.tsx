
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCultivation } from "@/context/CultivationContext";
import { VarietySelector } from "./VarietySelector";

interface SessionDialogFormProps {
  isEditing: boolean;
  currentSession: {
    id: string;
    name: string;
    startDate: Date;
    selectedVarieties?: string[];
  } | null;
  onOpenChange: (open: boolean) => void;
  onSessionCreated?: (sessionId: string) => void;
}

export const SessionDialogForm = ({ 
  isEditing, 
  currentSession, 
  onOpenChange,
  onSessionCreated
}: SessionDialogFormProps) => {
  const [sessionName, setSessionName] = useState("");
  const [sessionDateText, setSessionDateText] = useState("");
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { 
    startCultivationSession, 
    updateSession,
    varieties
  } = useCultivation();

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
    } else {
      // Set today's date as default for new sessions
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      setSessionDateText(`${day}/${month}/${year}`);
    }
  }, [isEditing, currentSession]);

  const resetForm = () => {
    // Only reset if not editing or dialog is closing
    if (!isEditing) {
      setSessionName("");
      setSessionDateText("");
      setSelectedVarieties([]);
      setDateError(null);
    }
  };

  const handleDateChange = (value: string) => {
    setSessionDateText(value);
    setDateError(null);
  };

  const handleSaveSession = async () => {
    if (sessionName.trim() && sessionDateText && selectedVarieties.length > 0) {
      setIsSubmitting(true);
      
      try {
        // Parse the date from the French format (DD/MM/YYYY)
        const [day, month, year] = sessionDateText.split('/').map(num => parseInt(num, 10));
        
        // JavaScript months are 0-indexed
        const sessionStartDate = new Date(year, month - 1, day);
        
        // Check if this is a valid date
        if (isNaN(sessionStartDate.getTime())) {
          setDateError("Format de date invalide. Utilisez JJ/MM/AAAA");
          setIsSubmitting(false);
          return;
        }
        
        if (isEditing && currentSession) {
          // Pour l'édition, mettre à jour la session existante
          await updateSession({
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
            console.log("Starting cultivation session with:", { sessionName, sessionStartDate, selectedVarieties });
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
              description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la création de la session.",
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
        }
        
        onOpenChange(false);
        resetForm();
      } catch (error) {
        console.error("Erreur lors du traitement:", error);
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Une erreur s'est produite lors du traitement.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
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
        
        <VarietySelector 
          selectedVarieties={selectedVarieties}
          setSelectedVarieties={setSelectedVarieties}
          varieties={varieties}
        />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button 
          variant={isEditing ? "default" : "success"}
          onClick={handleSaveSession} 
          disabled={!sessionName.trim() || !sessionDateText || selectedVarieties.length === 0 || isSubmitting}
        >
          {isSubmitting ? "En cours..." : isEditing ? "Enregistrer les modifications" : "Créer la session"}
        </Button>
      </div>
    </div>
  );
};
