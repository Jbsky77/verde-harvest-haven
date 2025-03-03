
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BatchActions from "@/components/BatchActions";
import FertilizerButtons from "@/components/FertilizerButtons";
import VarietyManagementTab from "@/components/dashboard/VarietyManagementTab";
import SettingsButtons from "@/components/SettingsButtons";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
import { useLocation } from "react-router-dom";

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("batch");
  const location = useLocation();

  // Check for URL hash to determine initial tab
  useEffect(() => {
    // Check if we're being redirected from a sidebar navigation item
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-4 bg-white">
        <TabsTrigger 
          value="batch"
          className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          Actions
        </TabsTrigger>
        <TabsTrigger 
          value="analytics"
          className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
        >
          Analyses
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
        <TabsContent value="analytics">
          <AnalyticsTab />
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
