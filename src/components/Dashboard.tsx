
import { useState } from "react";
import SpaceOverview from "@/components/space-overview";
import SessionDialog from "@/components/session/SessionDialog";
import ActiveSessionCard from "@/components/session/ActiveSessionCard";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SessionsTable from "@/components/session/SessionsTable";
import { useCultivation } from "@/context/CultivationContext";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false);
  const { currentSession, sessions, selectedSpaceId, getSpaceById } = useCultivation();
  const location = useLocation();
  const isSpacesRoute = location.pathname === "/spaces";
  
  const activeSessions = sessions.filter(session => session.isActive);
  
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
  
  // Get the selected space for the DashboardTabs component
  const selectedSpace = selectedSpaceId ? getSpaceById(selectedSpaceId) : null;
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto pb-16">
        <DashboardHeader 
          showAllSpaces={showAllSpaces}
          setShowAllSpaces={setShowAllSpaces}
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
        
        {!isSpacesRoute && (
          <>
            <SpaceOverview showAllSpaces={showAllSpaces} />
            
            <div className="px-6 py-8">
              {selectedSpace && <DashboardTabs space={selectedSpace} />}
            </div>
          </>
        )}
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
