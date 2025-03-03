
import { useCultivation } from "@/context/CultivationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SessionDialog from "./SessionDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { 
  SessionProgressBar, 
  HarvestCountdown, 
  SessionChart, 
  SessionVarietyList,
  generateChartData
} from "./active-session";

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
  const isMobile = useMediaQuery('(max-width: 768px)');

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
  
  const daysRemaining = maxHarvestDate ? 
    Math.max(Math.ceil((maxHarvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)), 0) : 
    Math.max(Math.ceil(totalDuration - elapsedDays), 0);
  
  const chartData = generateChartData(
    currentSession, 
    varieties, 
    startDate, 
    totalDuration, 
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
        <CardHeader className={`pb-2 ${isMobile ? 'px-3' : ''}`}>
          <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-${isMobile ? 'start' : 'center'}`}>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Session en cours: {currentSession.name}
            </CardTitle>
            <div className={`flex gap-2 ${isMobile ? 'mt-2 w-full justify-between' : ''}`}>
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"} 
                className="h-8 bg-white hover:bg-green-100"
                onClick={() => setEditSessionOpen(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isMobile ? "" : "Modifier"}
              </Button>
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"} 
                className="h-8 bg-white hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {isMobile ? "" : "Terminer"}
              </Button>
            </div>
          </div>
          <CardDescription className="text-green-700">
            Démarrée le {formatDateToLocale(new Date(currentSession.startDate))}
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'px-3 py-3' : ''}>
          <div className="space-y-3">
            <SessionProgressBar 
              progressPercent={progressPercent}
              elapsedDays={elapsedDays}
              totalDuration={totalDuration}
              daysRemaining={daysRemaining}
            />
            
            <HarvestCountdown 
              daysRemaining={daysRemaining}
              formatDateToLocale={formatDateToLocale}
              maxHarvestDate={maxHarvestDate}
            />
            
            <SessionChart 
              chartData={chartData}
              currentSession={currentSession}
              varieties={varieties}
              currentDayMarker={currentDayMarker}
              totalDuration={totalDuration}
              startDate={startDate}
              formatDateToLocale={formatDateToLocale}
            />
            
            <SessionVarietyList 
              currentSession={currentSession}
              varieties={varieties}
              getEstimatedHarvestDateForVariety={getEstimatedHarvestDateForVariety}
              getMaxHarvestDateForSession={getMaxHarvestDateForSession}
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
          <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
              className={isMobile ? "w-full" : ""}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSession}
              className={isMobile ? "w-full" : ""}
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
