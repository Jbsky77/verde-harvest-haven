
import { useState, useMemo } from "react";
import { useCultivation } from "@/context/cultivationContext";
import { CultivationSpace, Plant, PlantState } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import RoomInfo from "./RoomInfo";
import PlantStateChart from "./PlantStateChart";
import VarietyDistributionChart from "./VarietyDistributionChart";
import MetricsChart from "./MetricsChart";
import { countPlantsByState, countPlantsByVariety } from "./utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SpaceOverview = () => {
  const { spaces, selectedSpaceId, getSpaceById } = useCultivation();
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  
  const selectedSpace = useMemo(() => {
    return getSpaceById(selectedSpaceId || 0);
  }, [getSpaceById, selectedSpaceId]);
  
  if (!selectedSpace) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Sélectionnez un espace pour voir les détails</p>
      </div>
    );
  }
  
  const totalPlants = selectedSpace.plants.length;
  
  // Calculate plant state counts
  const plantStateCounts = countPlantsByState(selectedSpace.plants);
  
  // Calculate variety distribution
  const varietyDistribution = countPlantsByVariety(selectedSpace.plants);
  
  // Calculate average pH and EC
  const calculateAverages = (plants: Plant[]) => {
    if (plants.length === 0) return { avgPH: 0, avgEC: 0 };
    
    const totalPH = plants.reduce((sum, plant) => sum + plant.ph, 0);
    const totalEC = plants.reduce((sum, plant) => sum + plant.ec, 0);
    
    return {
      avgPH: Number((totalPH / plants.length).toFixed(2)),
      avgEC: Number((totalEC / plants.length).toFixed(2))
    };
  };
  
  const { avgPH, avgEC } = calculateAverages(selectedSpace.plants);
  
  // Group plants by growth state for chart data
  const getStateData = () => {
    return Object.entries(plantStateCounts).map(([state, count]) => ({
      name: state,
      value: count,
    }));
  };
  
  // Calculate historical data for metrics (mock data for now)
  const getHistoricalData = () => {
    // In a real app, this would come from a database or API
    // For now, we'll generate some mock data
    const mockData = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        ph: (6 + Math.random() * 0.5).toFixed(2),
        ec: (1.2 + Math.random() * 0.6).toFixed(2)
      });
    }
    
    return mockData;
  };
  
  const historicalData = getHistoricalData();
  
  // Generate variety distribution data for chart
  const getVarietyData = () => {
    return Object.entries(varietyDistribution).map(([name, count]) => ({
      name,
      count: Number(count) // Convert to number to fix the type issue
    }));
  };
  
  // Calculate metrics for room analytics
  const calculateMetrics = (space: CultivationSpace) => {
    // Count plants in different states
    const stateCounts: Record<PlantState, number> = {
      germination: 0,
      growth: 0,
      flowering: 0,
      drying: 0,
      harvested: 0
    };
    
    space.plants.forEach(plant => {
      stateCounts[plant.state]++;
    });
    
    // Calculate metrics
    const totalPlantCapacity = space.rows * space.columns;
    const occupancy = totalPlants / totalPlantCapacity;
    const readyForHarvest = stateCounts.flowering;
    
    return {
      totalCapacity: totalPlantCapacity,
      occupancy: Math.round(occupancy * 100),
      readyForHarvest,
      avgPH,
      avgEC
    };
  };
  
  const metrics = calculateMetrics(selectedSpace);
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{selectedSpace.name}</h2>
        <p className="text-muted-foreground">
          {selectedSpace.roomType === "flowering" ? "Salle de floraison" : "Salle de croissance"} - 
          {totalPlants} plantes sur {metrics.totalCapacity} emplacements
        </p>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 pt-4">
          <RoomInfo space={selectedSpace} metrics={metrics} />
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des états</CardTitle>
              </CardHeader>
              <CardContent>
                <PlantStateChart data={getStateData()} />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {Object.entries(plantStateCounts).map(([state, count]) => (
                    <div key={state} className="flex justify-between">
                      <span className="text-sm capitalize">{state}</span>
                      <span className="text-sm font-medium">{count} plantes</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribution des variétés</CardTitle>
              </CardHeader>
              <CardContent>
                <VarietyDistributionChart data={getVarietyData()} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-6 pt-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Évolution des métriques</h3>
            <Card>
              <CardContent className="pt-6">
                <MetricsChart data={historicalData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpaceOverview;
