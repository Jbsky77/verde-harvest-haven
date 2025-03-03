
import { useCultivation } from "@/context/CultivationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantState } from "@/types";
import { PlantStateChart } from "./PlantStateChart";
import { MetricsChart } from "./MetricsChart";
import { VarietyDistributionChart } from "./VarietyDistributionChart";
import { SpaceContent } from "./SpaceContent";

interface SpaceOverviewProps {
  showAllSpaces?: boolean;
}

const SpaceOverview = ({ showAllSpaces = false }: SpaceOverviewProps) => {
  const { selectedSpaceId, getSpaceById, spaces } = useCultivation();
  
  const getAllPlants = () => {
    return spaces.flatMap(space => space.plants);
  };
  
  const getSpaceData = () => {
    if (showAllSpaces) {
      const allPlants = getAllPlants();
      return {
        id: 0,
        name: "Tous les espaces",
        plants: allPlants,
        rows: spaces.reduce((sum, space) => sum + space.rows, 0),
        plantsPerRow: Math.round(allPlants.length / spaces.reduce((sum, space) => sum + space.rows, 0)) || 0
      };
    } else if (selectedSpaceId) {
      return getSpaceById(selectedSpaceId);
    }
    return null;
  };
  
  const spaceData = getSpaceData();
  
  if (!spaceData) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Card className="w-full max-w-md text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle>Aucun espace sélectionné</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Sélectionnez un espace dans le menu latéral pour voir les détails</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const plantsByState = spaceData.plants.reduce((acc, plant) => {
    acc[plant.state] = (acc[plant.state] || 0) + 1;
    return acc;
  }, {} as Record<PlantState, number>);
  
  const averageEC = spaceData.plants.reduce((sum, plant) => sum + plant.ec, 0) / spaceData.plants.length;
  const averagePH = spaceData.plants.reduce((sum, plant) => sum + plant.ph, 0) / spaceData.plants.length;
  
  const varietiesData = spaceData.plants.reduce((acc, plant) => {
    const variety = plant.variety.name;
    acc[variety] = (acc[variety] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const varietyDistributionData = Object.entries(varietiesData)
    .map(([name, count]) => ({
      name,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);
  
  return (
    <div className="p-6 animate-fade-in bg-gradient-to-b from-gray-50 to-white">
      <div className="mb-6 pb-4 border-b">
        <h2 className="text-3xl font-bold text-gray-800">
          {showAllSpaces ? "Tous les espaces" : spaceData.name}
          {showAllSpaces && <span className="text-sm font-normal text-gray-500 ml-2">({spaces.length} espaces)</span>}
        </h2>
        <p className="text-muted-foreground mt-1">
          {spaceData.plants.length} plantes
          {!showAllSpaces && ` • ${spaceData.rows} rangées`}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <PlantStateChart plantsByState={plantsByState} />
        <MetricsChart 
          averageEC={averageEC} 
          averagePH={averagePH} 
          showAllSpaces={showAllSpaces} 
        />
        <VarietyDistributionChart 
          varietyDistributionData={varietyDistributionData} 
          showAllSpaces={showAllSpaces} 
        />
      </div>
      
      <SpaceContent 
        spaceData={spaceData} 
        showAllSpaces={showAllSpaces} 
      />
    </div>
  );
};

export default SpaceOverview;
