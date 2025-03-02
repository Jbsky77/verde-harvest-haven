
import BatchActions from "@/components/BatchActions";
import SpaceOverview from "@/components/SpaceOverview";
import FertilizerButtons from "@/components/FertilizerButtons";
import VarietyButtons from "@/components/VarietyButtons";
import SettingsButtons from "@/components/SettingsButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="flex-1 overflow-auto pb-16">
        <SpaceOverview />
      </div>
      
      <div className={`${isMobile ? 'w-full' : 'w-96'} bg-gray-50 border-l p-4 lg:p-6 flex-shrink-0 max-h-screen overflow-y-auto`}>
        <div className="sticky top-0">
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
