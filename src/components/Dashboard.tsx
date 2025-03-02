
import BatchActions from "@/components/BatchActions";
import SpaceOverview from "@/components/SpaceOverview";
import FertilizerButtons from "@/components/FertilizerButtons";
import VarietyButtons from "@/components/VarietyButtons";
import SettingsButtons from "@/components/SettingsButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="flex-1 overflow-auto pb-16">
        <SpaceOverview />
      </div>
      <div className="w-full md:w-80 p-6 flex-shrink-0">
        <Tabs defaultValue="batch" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="batch">Actions</TabsTrigger>
            <TabsTrigger value="fertilizers">Engrais</TabsTrigger>
            <TabsTrigger value="varieties">Variétés</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
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
  );
};

export default Dashboard;
