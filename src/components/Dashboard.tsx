
import { useState } from "react";
import SessionDialog from "@/components/session/SessionDialog";
import ActiveSessionCard from "@/components/session/ActiveSessionCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SessionsTable from "@/components/session/SessionsTable";
import { useCultivation } from "@/context/CultivationContext";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false);
  const { currentSession, sessions } = useCultivation();
  
  const formatDateToLocale = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSessionCreated = (sessionId: string) => {
    console.log("New session created:", sessionId);
    // Any additional actions after session creation can be handled here
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto pb-16">
        <DashboardHeader 
          showAllSpaces={false}
          setShowAllSpaces={() => {}}
          onNewSessionClick={() => setNewSessionDialogOpen(true)}
        />

        {currentSession && currentSession.isActive && (
          <div className="px-6 pt-4">
            <ActiveSessionCard formatDateToLocale={formatDateToLocale} />
          </div>
        )}
        
        <div className="px-6 pt-4">
          <SessionsTable formatDateToLocale={formatDateToLocale} />
          <Separator className="my-6" />
        </div>
      </div>
      
      <SessionDialog 
        open={newSessionDialogOpen} 
        onOpenChange={setNewSessionDialogOpen}
        onSessionCreated={handleSessionCreated}
      />
    </div>
  );
};

export default Dashboard;
