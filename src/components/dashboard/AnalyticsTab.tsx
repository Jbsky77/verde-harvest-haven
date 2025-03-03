
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";
import { useCultivation } from "@/context/CultivationContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsTab = () => {
  const { spaces, varieties } = useCultivation();

  // Calculer les statistiques globales
  const totalPlants = spaces.flatMap(space => space.plants).length;
  const plantsInGrowth = spaces.flatMap(space => space.plants).filter(p => p.state === "growth").length;
  const plantsInFlowering = spaces.flatMap(space => space.plants).filter(p => p.state === "flowering").length;
  const plantsInHarvest = spaces.flatMap(space => space.plants).filter(p => p.state === "harvested").length;

  // Données pour le graphique de distribution des états
  const stateDistributionData = [
    { name: "Germination", value: spaces.flatMap(space => space.plants).filter(p => p.state === "germination").length },
    { name: "Croissance", value: plantsInGrowth },
    { name: "Floraison", value: plantsInFlowering },
    { name: "Séchage", value: spaces.flatMap(space => space.plants).filter(p => p.state === "drying").length },
    { name: "Récolté", value: plantsInHarvest },
  ];

  // Couleurs pour le graphique
  const colors = ["#9b87f5", "#06b6d4", "#f43f5e", "#f97316", "#10b981"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Plantes totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalPlants}</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-500" />
              En croissance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cyan-500">{plantsInGrowth}</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5 text-pink-500" />
              En floraison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-pink-500">{plantsInFlowering}</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="h-5 w-5 text-emerald-500" />
              Récoltées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-500">{plantsInHarvest}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Distribution des états de culture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stateDistributionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Nombre de plantes" fill="#8884d8">
                  {stateDistributionData.map((entry, index) => (
                    <Bar key={`cell-${index}`} dataKey="value" fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Analyses avancées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Des analyses plus détaillées de vos cultures seront disponibles prochainement. Vous pourrez suivre les tendances de croissance, comparer les performances des variétés et optimiser vos cycles de culture.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
