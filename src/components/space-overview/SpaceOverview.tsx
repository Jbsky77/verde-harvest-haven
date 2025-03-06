
import { useCultivation } from "@/context/CultivationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantState, RoomType } from "@/types";
import { PlantStateChart } from "./PlantStateChart";
import { MetricsChart } from "./MetricsChart";
import { VarietyDistributionChart } from "./VarietyDistributionChart";
import { SpaceContent } from "./SpaceContent";
import { RoomInfo } from "./RoomInfo";
import { useLocation } from "react-router-dom";

interface SpaceOverviewProps {
  showAllSpaces?: boolean;
}

const SpaceOverview = ({ showAllSpaces = false }: SpaceOverviewProps) => {
  const { selectedSpaceId, getSpaceById, spaces, selectedRoomType, getSpacesByRoomType } = useCultivation();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const getAllPlants = () => {
    return spaces.flatMap(space => space.plants);
  };
  
  const getAllPlantsByRoomType = (roomType: RoomType) => {
    return getSpacesByRoomType(roomType).flatMap(space => space.plants);
  };
  
  const getSpaceData = () => {
    if (showAllSpaces) {
      const roomSpaces = getSpacesByRoomType(selectedRoomType);
      const roomPlants = getAllPlantsByRoomType(selectedRoomType);
      
      return {
        id: 0,
        name: selectedRoomType === "growth" ? "Salle de Croissance" : "Salle de Floraison",
        plants: roomPlants,
        rows: roomSpaces.reduce((sum, space) => sum + space.rows, 0),
        plantsPerRow: Math.round(roomPlants.length / roomSpaces.reduce((sum, space) => sum + space.rows, 0)) || 0,
        roomType: selectedRoomType
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
  
  // Get data for both room types
  const growthRoomSpaces = getSpacesByRoomType("growth");
  const floweringRoomSpaces = getSpacesByRoomType("flowering");
  const growthRoomPlants = getAllPlantsByRoomType("growth");
  const floweringRoomPlants = getAllPlantsByRoomType("flowering");
  
  return (
    <div className="p-6 animate-fade-in bg-gradient-to-b from-gray-50 to-white">
      <div className="mb-6 pb-4 border-b">
        <h2 className="text-3xl font-bold text-gray-800">
          {showAllSpaces ? spaceData.name : spaceData.name}
          {showAllSpaces && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({getSpacesByRoomType(selectedRoomType).length} espaces)
            </span>
          )}
        </h2>
        <p className="text-muted-foreground mt-1">
          {spaceData.plants.length} plantes
          {!showAllSpaces && ` • ${spaceData.rows} rangées`}
        </p>
      </div>
      
      {/* Room summary cards - only shown on the main dashboard */}
      {showAllSpaces && currentPath === "/" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <RoomInfo 
            roomType="growth" 
            spaceCount={growthRoomSpaces.length}
            plantCount={growthRoomPlants.length}
          />
          <RoomInfo 
            roomType="flowering" 
            spaceCount={floweringRoomSpaces.length}
            plantCount={floweringRoomPlants.length}
          />
        </div>
      )}
      
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
