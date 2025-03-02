
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

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto pb-16">
        <div className="px-6 pt-6 flex justify-end">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-all-spaces"
              checked={showAllSpaces}
              onCheckedChange={setShowAllSpaces}
            />
            <Label htmlFor="show-all-spaces">Afficher tous les espaces</Label>
          </div>
        </div>
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
    </div>
  );
};

export default Dashboard;
