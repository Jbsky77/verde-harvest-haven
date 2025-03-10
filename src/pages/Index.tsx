
import { useMemo, useEffect } from "react";
import SideNavigation from "@/components/SideNavigation";
import Dashboard from "@/components/Dashboard";
import { useCultivation } from "@/context/CultivationContext";
import AlertPanel from "@/components/AlertPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { spaces, selectedSpaceId, setSelectedSpaceId, currentSession } = useCultivation();
  
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
          
          {currentSession && currentSession.isActive && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Session de culture active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Nom de la session: {currentSession.name}</p>
                    <p>Date de début: {new Date(currentSession.startDate).toLocaleDateString()}</p>
                    {currentSession.endDate && (
                      <p>Date de fin: {new Date(currentSession.endDate).toLocaleDateString()}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <AlertPanel onClose={() => {}} />
              </div>
            </div>
          )}
          
          {!currentSession || !currentSession.isActive && (
            <Card className="w-full text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader>
                <CardTitle>Aucune session active</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Vous devez démarrer une session de culture pour gérer votre application.
                </p>
                <p className="text-sm text-muted-foreground">
                  Utilisez le bouton "Nouvelle session" dans le tableau de bord pour commencer.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
