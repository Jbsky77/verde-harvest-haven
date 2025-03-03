import { useCultivation } from "@/context/CultivationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, CalendarIcon, Edit, Trash2, Timer } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SessionDialog from "./SessionDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

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
  
  const daysRemaining = maxHarvestDate ? 
    Math.max(Math.ceil((maxHarvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)), 0) : 
    Math.max(Math.ceil(totalDuration - elapsedDays), 0);
  
  const generateChartData = () => {
    if (!currentSession.selectedVarieties) return [];
    
    const data = [];
    const sessionDays = Math.ceil(totalDuration);
    
    for (let day = 0; day <= sessionDays; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      
      const dataPoint: any = {
        day,
        date: formatDateToLocale(date),
      };
      
      currentSession.selectedVarieties.forEach(varietyId => {
        const variety = varieties.find(v => v.id === varietyId);
        if (!variety || !variety.germinationTime || !variety.growthTime || !variety.floweringTime) return;
        
        const germDays = variety.germinationTime;
        const growthDays = variety.growthTime;
        const floweringDays = variety.floweringTime;
        
        let phase = "none";
        if (day <= germDays) {
          phase = "germination";
        } else if (day <= germDays + growthDays) {
          phase = "growth";
        } else if (day <= germDays + growthDays + floweringDays) {
          phase = "flowering";
        } else {
          phase = "harvest";
        }
        
        dataPoint[`${variety.name}`] = phase === "germination" ? 25 :
                                     phase === "growth" ? 50 :
                                     phase === "flowering" ? 75 :
                                     phase === "harvest" ? 100 : 0;
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };
  
  const chartData = generateChartData();
  
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
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Session en cours: {currentSession.name}
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 bg-white hover:bg-green-100"
                onClick={() => setEditSessionOpen(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 bg-white hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Terminer
              </Button>
            </div>
          </div>
          <CardDescription className="text-green-700">
            Démarrée le {formatDateToLocale(new Date(currentSession.startDate))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-green-800">Progression de la session</span>
                <Badge variant="outline" className="bg-white text-green-800">
                  {progressPercent}%
                </Badge>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="flex items-center justify-between mt-1 text-xs text-green-800">
                <span>Jour {Math.floor(elapsedDays)}/{Math.ceil(totalDuration)}</span>
                <div className="flex items-center">
                  <Timer className="h-3 w-3 mr-1" />
                  <span>{daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''} avant récolte</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <Timer className="h-5 w-5 text-green-700" />
                <span className="text-lg font-bold text-green-800">
                  {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} avant récolte
                </span>
              </div>
              <div className="text-center text-xs text-green-600 mt-1">
                Date estimée: {formatDateToLocale(maxHarvestDate)}
              </div>
            </div>
            
            <div className="h-48 mt-4 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    {currentSession.selectedVarieties?.map((varietyId, index) => {
                      const variety = varieties.find(v => v.id === varietyId);
                      if (!variety) return null;
                      return (
                        <linearGradient key={varietyId} id={`color${varietyId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={variety.color} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={variety.color} stopOpacity={0.2}/>
                        </linearGradient>
                      );
                    })}
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    tick={{fontSize: 10}}
                    tickFormatter={(day) => {
                      if (day === 0 || day === Math.floor(totalDuration) || day === currentDayMarker) {
                        const date = new Date(startDate);
                        date.setDate(date.getDate() + Number(day));
                        return formatDateToLocale(date).split('/').slice(0, 2).join('/');
                      }
                      return '';
                    }}
                  />
                  <YAxis 
                    tick={{fontSize: 10}} 
                    domain={[0, 100]}
                    tickFormatter={(value) => {
                      if (value === 0) return 'Début';
                      if (value === 25) return 'Germ.';
                      if (value === 50) return 'Croiss.';
                      if (value === 75) return 'Floraison';
                      if (value === 100) return 'Récolte';
                      return '';
                    }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      const numValue = Number(value);
                      const phase = 
                        numValue <= 25 ? "Germination" :
                        numValue <= 50 ? "Croissance" :
                        numValue <= 75 ? "Floraison" : "Récolte";
                      return [phase, name];
                    }}
                    labelFormatter={(day) => {
                      const date = new Date(startDate);
                      date.setDate(date.getDate() + Number(day));
                      return `Jour ${day}: ${formatDateToLocale(date)}`;
                    }}
                  />
                  
                  {currentSession.selectedVarieties?.map((varietyId) => {
                    const variety = varieties.find(v => v.id === varietyId);
                    if (!variety) return null;
                    return (
                      <Area 
                        key={varietyId}
                        type="monotone" 
                        dataKey={variety.name}
                        stroke={variety.color} 
                        fillOpacity={1}
                        fill={`url(#color${varietyId})`}
                      />
                    );
                  })}
                  
                  <XAxis 
                    dataKey="day"
                    xAxisId="current-day"
                    axisLine={false} 
                    tickLine={false}
                    tick={false}
                    height={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-1 mb-3">
              {currentSession.selectedVarieties?.map((varietyId) => {
                const variety = varieties.find(v => v.id === varietyId);
                if (!variety) return null;
                return (
                  <div key={varietyId} className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: variety.color }}
                    />
                    <span className="text-xs text-green-800">{variety.name}</span>
                  </div>
                );
              })}
            </div>
            
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSession}
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
