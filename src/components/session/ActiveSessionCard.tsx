
import { useCultivation } from "@/context/CultivationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import SessionDialog from "./SessionDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { VarietyCountDisplay } from "./dialog";
import { 
  SessionProgressHeader,
  SessionGrowthChart,
  VarietyLegend,
  EstimatedYield,
  HarvestDates,
  FinalHarvestDate,
  SessionActions
} from "./active-session";
import { calculateEstimatedYield, generateChartData } from "./active-session/utils";

interface ActiveSessionCardProps {
  formatDateToLocale: (date: Date | null) => string;
}

const ActiveSessionCard = ({ formatDateToLocale }: ActiveSessionCardProps) => {
  const { 
    currentSession, 
    varieties, 
    getEstimatedHarvestDateForVariety,
    getMaxHarvestDateForSession,
    endCultivationSession
  } = useCultivation();
  
  const [editSessionOpen, setEditSessionOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { toast } = useToast();

  if (!currentSession || !currentSession.isActive) {
    return null;
  }

  const startDate = new Date(currentSession.startDate);
  const today = new Date();
  const maxHarvestDate = getMaxHarvestDateForSession(currentSession);
  
  const totalDuration = maxHarvestDate ? 
    (maxHarvestDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) : 
    90; // Default to 90 days if no harvest date
  
  const elapsedDays = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const progressPercent = Math.min(Math.max(Math.round((elapsedDays / totalDuration) * 100), 0), 100);

  // Calculate total estimated yield
  const totalEstimatedYield = calculateEstimatedYield(currentSession.varietyCounts, varieties);
  const totalEstimatedYieldInKg = totalEstimatedYield / 1000;
  
  // Generate chart data
  const chartData = generateChartData(
    currentSession, 
    startDate, 
    totalDuration, 
    varieties,
    formatDateToLocale
  );
  
  const currentDayMarker = Math.floor(elapsedDays);
  
  const handleDeleteSession = () => {
    endCultivationSession(currentSession.id);
    setDeleteConfirmOpen(false);
    toast({
      title: "Session terminée",
      description: `La session "${currentSession.name}" a été terminée avec succès.`,
      variant: "default",
    });
  };

  return (
    <>
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Session en cours: {currentSession.name}
            </CardTitle>
            <SessionActions 
              onEdit={() => setEditSessionOpen(true)}
              onDelete={() => setDeleteConfirmOpen(true)}
            />
          </div>
          <CardDescription className="text-green-700">
            Démarrée le {formatDateToLocale(new Date(currentSession.startDate))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <SessionProgressHeader 
              progressPercent={progressPercent}
              maxHarvestDate={maxHarvestDate}
              formatDateToLocale={formatDateToLocale}
            />
            
            <SessionGrowthChart 
              chartData={chartData}
              varieties={varieties}
              selectedVarieties={currentSession.selectedVarieties}
              currentDayMarker={currentDayMarker}
              formatDateToLocale={formatDateToLocale}
            />
            
            <VarietyLegend 
              selectedVarieties={currentSession.selectedVarieties}
              varieties={varieties}
            />
            
            <EstimatedYield totalEstimatedYieldInKg={totalEstimatedYieldInKg} />
            
            <div className="mt-4 pt-4 border-t border-green-200">
              <VarietyCountDisplay 
                varietyCounts={currentSession.varietyCounts} 
                varieties={varieties}
              />
            </div>
            
            <HarvestDates 
              selectedVarieties={currentSession.selectedVarieties}
              varieties={varieties}
              getEstimatedHarvestDateForVariety={getEstimatedHarvestDateForVariety}
              formatDateToLocale={formatDateToLocale}
            />
            
            <FinalHarvestDate 
              maxHarvestDate={maxHarvestDate}
              formatDateToLocale={formatDateToLocale}
            />
          </div>
        </CardContent>
      </Card>
      
      <SessionDialog 
        open={editSessionOpen} 
        onOpenChange={setEditSessionOpen}
        isEditing={true}
        currentSession={currentSession}
      />
      
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Terminer la session</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir terminer la session en cours "{currentSession.name}" ?
              Cette action n'est pas réversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSession}
            >
              Terminer la session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActiveSessionCard;
