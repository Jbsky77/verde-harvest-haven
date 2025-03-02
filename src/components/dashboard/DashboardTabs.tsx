
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BatchActions from "@/components/BatchActions";
import FertilizerButtons from "@/components/FertilizerButtons";
import VarietyButtons from "@/components/VarietyButtons";
import SettingsButtons from "@/components/SettingsButtons";

const DashboardTabs = () => {
  return (
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
  );
};

export default DashboardTabs;
