
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlantGrid from "@/components/PlantGrid";
import { PlantsList } from "@/components/plants";
import { CultivationSpace } from "@/types";

interface SpaceContentProps {
  spaceData: CultivationSpace;
  showAllSpaces: boolean;
}

export const SpaceContent = ({ spaceData, showAllSpaces }: SpaceContentProps) => {
  if (showAllSpaces) {
    return (
      <div className="mt-6">
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 border-b pb-4">
            <CardTitle>Vue d'ensemble</CardTitle>
            <CardDescription>
              Sélectionnez un espace spécifique pour voir sa grille et sa liste de plantes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-center text-gray-500">
            <p>En mode "Tous les espaces", seules les statistiques globales sont affichées.</p>
            <p className="mt-2">Pour accéder à la grille ou à la liste des plantes, veuillez désactiver l'option "Afficher tous les espaces" ou sélectionner un espace spécifique.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
              {spaceData.rows} lignes de {spaceData.plantsPerRow} plantes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <PlantGrid space={spaceData} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="list" className="mt-0">
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 border-b pb-4">
            <CardTitle>Liste des plantes</CardTitle>
            <CardDescription>
              {spaceData.plants.length} plantes au total
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <PlantsList space={spaceData} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
