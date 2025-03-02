
import BatchActions from "@/components/BatchActions";
import SpaceOverview from "@/components/SpaceOverview";
import FertilizerButtons from "@/components/FertilizerButtons";
import VarietyButtons from "@/components/VarietyButtons";
import SettingsButtons from "@/components/SettingsButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCultivation } from "@/context/CultivationContext";
import { CalendarIcon, PlayIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const { startCultivationSession, currentSession } = useCultivation();
  
  const handleStartSession = () => {
    if (sessionName.trim()) {
      startCultivationSession(sessionName, new Date());
      setNewSessionDialogOpen(false);
      setSessionName("");
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto pb-16">
        <div className="px-6 pt-6 flex justify-between items-center">
          <Button 
            onClick={() => setNewSessionDialogOpen(true)}
            variant="success"
            className="flex items-center gap-2"
            disabled={!!currentSession?.isActive}
          >
            <PlayIcon size={16} />
            Démarrer une nouvelle session
          </Button>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="show-all-spaces"
              checked={showAllSpaces}
              onCheckedChange={setShowAllSpaces}
            />
            <Label htmlFor="show-all-spaces">Afficher tous les espaces</Label>
          </div>
        </div>
        <SpaceOverview showAllSpaces={showAllSpaces} />
        
        <div className="px-6 py-8">
          <Tabs defaultValue="batch" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4 bg-white">
              <TabsTrigger 
                value="batch"
                className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
              >
                Actions
              </TabsTrigger>
              <TabsTrigger 
                value="fertilizers"
                className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
              >
                Engrais
              </TabsTrigger>
              <TabsTrigger 
                value="varieties"
                className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
              >
                Variétés
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
              >
                Paramètres
              </TabsTrigger>
            </TabsList>
            <div className="bg-gray-50 border rounded-lg p-4 lg:p-6">
              <TabsContent value="batch">
                <BatchActions />
              </TabsContent>
              <TabsContent value="fertilizers">
                <FertilizerButtons />
              </TabsContent>
              <TabsContent value="varieties">
                <VarietyButtons />
              </TabsContent>
              <TabsContent value="settings">
                <SettingsButtons />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={newSessionDialogOpen} onOpenChange={setNewSessionDialogOpen}>
        <DialogContent>
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
                <div className="flex items-center h-10 px-3 mt-1 rounded-md border border-input">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">La date de début est définie à aujourd'hui</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSessionDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="success" onClick={handleStartSession} disabled={!sessionName.trim()}>
              Démarrer la session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
