
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BatchActions from "@/components/BatchActions";
import FertilizerButtons from "@/components/FertilizerButtons";
import VarietyManagementTab from "@/components/dashboard/VarietyManagementTab";
import SettingsButtons from "@/components/SettingsButtons";
import { CultivationSpace } from "@/types";
import { useTranslation } from "react-i18next";

interface DashboardTabsProps {
  space: CultivationSpace;
}

const DashboardTabs = ({ space }: DashboardTabsProps) => {
  const { t } = useTranslation();
  
  return (
    <Tabs defaultValue="batch" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-4 bg-white">
        <TabsTrigger 
          value="batch"
          className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {t('tabs.actions')}
        </TabsTrigger>
        <TabsTrigger 
          value="fertilizers"
          className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {t('tabs.fertilizers')}
        </TabsTrigger>
        <TabsTrigger 
          value="varieties"
          className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {t('tabs.varieties')}
        </TabsTrigger>
        <TabsTrigger 
          value="settings"
          className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          {t('tabs.settings')}
        </TabsTrigger>
      </TabsList>
      <div className="bg-gray-50 border rounded-lg p-4 lg:p-6">
        <TabsContent value="batch">
          <BatchActions space={space} />
        </TabsContent>
        <TabsContent value="fertilizers">
          <FertilizerButtons />
        </TabsContent>
        <TabsContent value="varieties">
          <VarietyManagementTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsButtons />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default DashboardTabs;
