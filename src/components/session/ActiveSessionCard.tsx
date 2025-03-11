
import { useCultivation } from "@/context/cultivationContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import SessionDialog from "./SessionDialog";
import { useToast } from "@/hooks/use-toast";
import { VarietyCountDisplay } from "./dialog";
import { SessionHeader, SessionChartSection, VarietiesList, SessionFooter } from "./card";
import DeleteSessionDialog from "./DeleteSessionDialog";

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
        <CardHeader>
          <SessionHeader 
            currentSession={currentSession}
            formatDateToLocale={formatDateToLocale}
            onEdit={() => setEditSessionOpen(true)}
            onDelete={() => setDeleteConfirmOpen(true)}
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <SessionChartSection 
              currentSession={currentSession}
              formatDateToLocale={formatDateToLocale}
              startDate={startDate}
              totalDuration={totalDuration}
              elapsedDays={elapsedDays}
              progressPercent={progressPercent}
              maxHarvestDate={maxHarvestDate}
            />
            
            <div className="mt-4 pt-4 border-t border-green-200">
              <VarietyCountDisplay 
                varietyCounts={currentSession.varietyCounts} 
                varieties={varieties}
              />
            </div>
            
            <VarietiesList 
              currentSession={currentSession}
              varieties={varieties}
              getEstimatedHarvestDateForVariety={getEstimatedHarvestDateForVariety}
              formatDateToLocale={formatDateToLocale}
            />
            
            <SessionFooter 
              currentSession={currentSession}
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
      
      <DeleteSessionDialog 
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        currentSession={currentSession}
        onConfirmDelete={handleDeleteSession}
      />
    </>
  );
};

export default ActiveSessionCard;
