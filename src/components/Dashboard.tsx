
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
import { CalendarIcon, PlayIcon, X, Check, InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionStartDate, setSessionStartDate] = useState<Date>(new Date());
  const { 
    startCultivationSession, 
    currentSession, 
    varieties, 
    getEstimatedHarvestDateForVariety,
    getMaxHarvestDateForSession
  } = useCultivation();
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);
  
  // Create a date for January 1, 2025
  const jan2025 = new Date(2025, 0, 1);
  
  const handleStartSession = () => {
    if (sessionName.trim()) {
      startCultivationSession(sessionName, sessionStartDate, selectedVarieties);
      setNewSessionDialogOpen(false);
      setSessionName("");
      setSelectedVarieties([]);
      setSessionStartDate(new Date());
    }
  };

  const handleCheckVariety = (varietyId: string, checked: boolean) => {
    if (checked) {
      setSelectedVarieties(prev => [...prev, varietyId]);
    } else {
      setSelectedVarieties(prev => prev.filter(id => id !== varietyId));
    }
  };

  const selectAllVarieties = () => {
    setSelectedVarieties(varieties.map(v => v.id));
  };

  const deselectAllVarieties = () => {
    setSelectedVarieties([]);
  };

  const formatDateToLocale = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString();
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

        {currentSession && currentSession.isActive && (
          <div className="px-6 pt-4">
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Session en cours: {currentSession.name}
                </CardTitle>
                <CardDescription className="text-green-700">
                  Démarrée le {formatDateToLocale(new Date(currentSession.startDate))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentSession.selectedVarieties && currentSession.selectedVarieties.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">Variétés cultivées</span>
                        <span className="text-sm text-green-800">Date de récolte estimée</span>
                      </div>
                      <div className="space-y-2">
                        {currentSession.selectedVarieties.map(varietyId => {
                          const variety = varieties.find(v => v.id === varietyId);
                          if (!variety) return null;

                          const harvestDate = getEstimatedHarvestDateForVariety(varietyId);
                          
                          return (
                            <div key={varietyId} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: variety.color }}
                                />
                                <span className="text-sm text-green-800">{variety.name}</span>
                              </div>
                              <Badge variant="outline" className="bg-white text-green-800">
                                {formatDateToLocale(harvestDate)}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                      <div className="pt-2 border-t border-green-200 flex justify-between items-center">
                        <div className="flex items-center gap-1 text-green-800">
                          <InfoIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">Fin de récolte estimée</span>
                        </div>
                        <Badge className="bg-green-700">
                          {formatDateToLocale(getMaxHarvestDateForSession(currentSession))}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-green-800">Aucune variété sélectionnée pour cette session.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
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
        <DialogContent className="max-w-md">
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {sessionStartDate ? (
                        format(sessionStartDate, "d MMMM yyyy", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={sessionStartDate}
                      onSelect={(date) => date && setSessionStartDate(date)}
                      initialFocus
                      defaultMonth={jan2025}
                      captionLayout="dropdown-buttons"
                      fromYear={2023}
                      toYear={2030}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-sm text-muted-foreground mt-1">Choisissez la date de début de session (incluant les dates de 2025 et au-delà)</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Sélectionner les variétés</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={selectAllVarieties}
                      className="h-8 text-xs"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Tout sélectionner
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={deselectAllVarieties}
                      className="h-8 text-xs"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Tout désélectionner
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-44 border rounded-md p-2">
                  <div className="space-y-2">
                    {varieties.map((variety) => (
                      <div key={variety.id} className="flex items-center gap-2">
                        <Checkbox 
                          id={`variety-${variety.id}`}
                          checked={selectedVarieties.includes(variety.id)}
                          onCheckedChange={(checked) => handleCheckVariety(variety.id, checked === true)}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: variety.color }}
                        />
                        <Label 
                          htmlFor={`variety-${variety.id}`} 
                          className="flex-grow cursor-pointer text-sm"
                        >
                          {variety.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedVarieties.length} variété(s) sélectionnée(s) sur {varieties.length}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSessionDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="success" 
              onClick={handleStartSession} 
              disabled={!sessionName.trim() || selectedVarieties.length === 0}
            >
              Démarrer la session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
