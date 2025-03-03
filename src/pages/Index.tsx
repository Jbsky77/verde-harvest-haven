
import { useMemo, useState } from "react";
import SideNavigation from "@/components/SideNavigation";
import Dashboard from "@/components/Dashboard";
import { useCultivation } from "@/context/CultivationContext";
import { PlantsList } from "@/components/plants";
import SpaceOverview from "@/components/SpaceOverview";
import PlantGrid from "@/components/PlantGrid";
import BatchActions from "@/components/BatchActions";
import AlertPanel from "@/components/AlertPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const { spaces, selectedSpaceId } = useCultivation();
  const [alertPanelOpen, setAlertPanelOpen] = useState(false);
  
  const selectedSpace = useMemo(() => {
    return spaces.find(space => space.id === selectedSpaceId) || spaces[0];
  }, [spaces, selectedSpaceId]);

  return (
    <div className="min-h-screen flex bg-background">
      <SideNavigation />
      
      <main className="flex-1 flex flex-col">
        <div className="container py-6 space-y-6 flex-1 overflow-hidden">
          <Dashboard />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {selectedSpace && (
                <>
                  <SpaceOverview />
                  <BatchActions space={selectedSpace} />
                  <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                    <PlantsList space={selectedSpace} />
                  </ScrollArea>
                </>
              )}
            </div>
            
            <div className="space-y-6">
              <AlertPanel onClose={() => setAlertPanelOpen(false)} />
              {selectedSpace && <PlantGrid space={selectedSpace} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
