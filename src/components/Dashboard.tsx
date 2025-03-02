
import { useState } from "react";
import SpaceOverview from "@/components/SpaceOverview";
import SessionDialog from "@/components/session/SessionDialog";
import ActiveSessionCard from "@/components/session/ActiveSessionCard";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useCultivation } from "@/context/CultivationContext";

const Dashboard = () => {
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false);
  const { currentSession } = useCultivation();
  
  const formatDateToLocale = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
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
        
        <SpaceOverview showAllSpaces={showAllSpaces} />
        
        <div className="px-6 py-8">
          <DashboardTabs />
        </div>
      </div>
      
      <SessionDialog 
        open={newSessionDialogOpen} 
        onOpenChange={setNewSessionDialogOpen} 
      />
    </div>
  );
};

export default Dashboard;
