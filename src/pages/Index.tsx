
import { useMemo, useEffect } from "react";
import SideNavigation from "@/components/SideNavigation";
import Dashboard from "@/components/Dashboard";
import { useCultivation } from "@/context/CultivationContext";
import { PlantsList } from "@/components/plants";
import SpaceOverview from "@/components/space-overview";
import PlantGrid from "@/components/PlantGrid";
import BatchActions from "@/components/BatchActions";
import AlertPanel from "@/components/AlertPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { spaces, selectedSpaceId, setSelectedSpaceId, currentSession } = useCultivation();
  const location = useLocation();
  const isSpacesRoute = location.pathname === "/spaces";
  
  // Ensure we always have a selected space
  useEffect(() => {
    if (!selectedSpaceId && spaces.length > 0) {
      setSelectedSpaceId(spaces[0].id);
    }
  }, [spaces, selectedSpaceId, setSelectedSpaceId]);
  
  const selectedSpace = useMemo(() => {
    return spaces.find(space => space.id === selectedSpaceId) || spaces[0];
  }, [spaces, selectedSpaceId]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SideNavigation />
      
      <main className="flex-1 flex flex-col">
        <div className="container py-6 space-y-6 flex-1">
          <Dashboard />
          
          {isSpacesRoute && (
            <div className="animate-fade-in">
              <SpaceOverview />
            </div>
          )}
          
          {isSpacesRoute && currentSession && currentSession.isActive && selectedSpace && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                  <PlantsList key={`plant-list-${selectedSpaceId}`} space={selectedSpace} />
                </ScrollArea>
              </div>
              
              <div className="space-y-6">
                <BatchActions space={selectedSpace} />
                <AlertPanel onClose={() => {}} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
