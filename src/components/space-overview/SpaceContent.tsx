
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlantGrid from "@/components/PlantGrid";
import { PlantsList } from "@/components/plants";
import { CultivationSpace } from "@/types";
import { useTranslation } from "react-i18next";

interface SpaceContentProps {
  spaceData: CultivationSpace;
  showAllSpaces: boolean;
}

export const SpaceContent = ({ spaceData, showAllSpaces }: SpaceContentProps) => {
  const { t } = useTranslation();
  
  if (showAllSpaces) {
    return (
      <div className="mt-6">
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 border-b pb-4">
            <CardTitle>{t('space.overview')}</CardTitle>
            <CardDescription>
              {t('space.selectSpecific')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-center text-gray-500">
            <p>{t('space.allSpacesMode')}</p>
            <p className="mt-2">{t('space.accessInstructions')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Tabs defaultValue="grid" className="w-full">
      <TabsList className="mb-4 bg-gray-100 p-1">
        <TabsTrigger value="grid" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{t('space.grid')}</TabsTrigger>
        <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">{t('space.list')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="grid" className="mt-0">
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 border-b pb-4">
            <CardTitle>{t('space.gridView')}</CardTitle>
            <CardDescription>
              {spaceData.rows} {t('space.rowsOf')} {spaceData.plantsPerRow} {t('space.plantsPerRow')}
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
            <CardTitle>{t('space.plantsList')}</CardTitle>
            <CardDescription>
              {spaceData.plants.length} {t('space.totalPlants')}
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
