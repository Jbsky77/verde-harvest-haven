
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useCultivation } from "@/context/CultivationContext";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SessionDialog = ({ open, onOpenChange }: SessionDialogProps) => {
  const [sessionName, setSessionName] = useState("");
  const [sessionStartDate, setSessionStartDate] = useState<Date>(new Date());
  const { startCultivationSession, varieties } = useCultivation();
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);
  
  // Create a date for January 1, 2025
  const jan2025 = new Date(2025, 0, 1);

  const handleStartSession = () => {
    if (sessionName.trim()) {
      startCultivationSession(sessionName, sessionStartDate, selectedVarieties);
      onOpenChange(false);
      setSessionName("");
      setSelectedVarieties([]);
      setSessionStartDate(new Date());
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Démarrer une nouvelle session de culture</DialogTitle>
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
              <Label>Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {sessionStartDate ? (
                      format(sessionStartDate, "d MMMM yyyy", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={sessionStartDate}
                    onSelect={(date) => date && setSessionStartDate(date)}
                    initialFocus
                    defaultMonth={jan2025}
                    captionLayout="dropdown-buttons"
                    fromYear={2023}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground mt-1">
                Choisissez la date de début de session (incluant les dates de 2025 et au-delà)
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
            variant="success" 
            onClick={handleStartSession} 
            disabled={!sessionName.trim() || selectedVarieties.length === 0}
          >
            Démarrer la session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDialog;
