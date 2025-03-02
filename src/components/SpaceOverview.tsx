
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
  
  const space = getSpaceById(selectedSpaceId);
  
  if (!space) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Card className="w-full max-w-md text-center p-8">
          <CardHeader>
            <CardTitle>Espace non trouvé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">L'espace sélectionné n'existe pas ou a été supprimé</p>
          </CardContent>
        </Card>
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
    <div className="p-6 animate-fade-in bg-gradient-to-b from-gray-50 to-white">
      <div className="mb-6 pb-4 border-b">
        <h2 className="text-3xl font-bold text-gray-800">{space.name}</h2>
        <p className="text-muted-foreground mt-1">
          {space.plants.length} plantes • {space.rows} rangées 
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4" style={{ borderTopColor: "#9b87f5" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#9b87f5]"></span>
              État des plantes
            </CardTitle>
            <CardDescription>Distribution par état</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {plantStateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} plantes`, '']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4" style={{ borderTopColor: "#06b6d4" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#06b6d4]"></span>
              Moyennes EC & pH
            </CardTitle>
            <CardDescription>Valeurs moyennes pour cet espace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'EC', value: averageEC },
                    { name: 'pH', value: averagePH }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 'dataMax + 1']} />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}`, '']} />
                  <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                    {[
                      { name: 'EC', value: averageEC },
                      { name: 'pH', value: averagePH }
                    ].map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#06b6d4' : '#9b87f5'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow-md transition-shadow border-t-4" style={{ borderTopColor: "#f43f5e" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#f43f5e]"></span>
              Distribution des variétés
            </CardTitle>
            <CardDescription>Nombre de plantes par variété</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={varietyDistributionData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  layout="vertical"
                >
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                  />
                  <Tooltip formatter={(value) => [`${value} plantes`, '']} />
                  <Bar 
                    dataKey="count" 
                    fill="#f43f5e" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4 bg-gray-100 p-1">
          <TabsTrigger value="grid" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Grille</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Liste</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="mt-0">
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 border-b pb-4">
              <CardTitle>Vue en grille</CardTitle>
              <CardDescription>
                {space.rows} lignes de {space.plantsPerRow} plantes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <PlantGrid space={space} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 border-b pb-4">
              <CardTitle>Liste des plantes</CardTitle>
              <CardDescription>
                {space.plants.length} plantes au total
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <PlantsList space={space} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpaceOverview;
