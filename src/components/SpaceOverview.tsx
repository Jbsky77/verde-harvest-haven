
import { useCultivation } from "@/context/CultivationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantState } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlantGrid from "@/components/PlantGrid";
import PlantsList from "@/components/PlantsList";
import { BarChart, PieChart, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SpaceOverview = () => {
  const { selectedSpaceId, getSpaceById } = useCultivation();
  
  if (!selectedSpaceId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Sélectionnez un espace pour voir les détails</p>
      </div>
    );
  }
  
  const space = getSpaceById(selectedSpaceId);
  
  if (!space) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Espace non trouvé</p>
      </div>
    );
  }
  
  // Count plants by state
  const plantsByState = space.plants.reduce((acc, plant) => {
    acc[plant.state] = (acc[plant.state] || 0) + 1;
    return acc;
  }, {} as Record<PlantState, number>);
  
  const stateColors = {
    germination: "#9b87f5",
    growth: "#06b6d4",
    flowering: "#f43f5e",
    drying: "#f97316",
    harvested: "#10b981"
  };
  
  const stateNames = {
    germination: "Germination",
    growth: "Croissance",
    flowering: "Floraison",
    drying: "Séchage",
    harvested: "Récolté"
  };
  
  const plantStateData = Object.entries(plantsByState).map(([state, count]) => ({
    name: stateNames[state as PlantState],
    value: count,
    color: stateColors[state as PlantState]
  }));
  
  // Average EC and pH data
  const averageEC = space.plants.reduce((sum, plant) => sum + plant.ec, 0) / space.plants.length;
  const averagePH = space.plants.reduce((sum, plant) => sum + plant.ph, 0) / space.plants.length;
  
  // Data for varieties distribution
  const varietiesData = space.plants.reduce((acc, plant) => {
    const variety = plant.variety.name;
    acc[variety] = (acc[variety] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const varietyDistributionData = Object.entries(varietiesData).map(([name, count]) => ({
    name,
    count
  }));
  
  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6">{space.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">État des plantes</CardTitle>
            <CardDescription>Distribution par état</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={plantStateData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {plantStateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Moyennes EC & pH</CardTitle>
            <CardDescription>Valeurs moyennes pour cet espace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'EC', value: averageEC },
                    { name: 'pH', value: averagePH }
                  ]}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 'dataMax + 1']} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribution des variétés</CardTitle>
            <CardDescription>Nombre de plantes par variété</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={varietyDistributionData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  layout="vertical"
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7E69AB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grille</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Vue en grille</CardTitle>
              <CardDescription>
                {space.rows} lignes de {space.plantsPerRow} plantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlantGrid space={space} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Liste des plantes</CardTitle>
              <CardDescription>
                {space.plants.length} plantes au total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlantsList space={space} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpaceOverview;
