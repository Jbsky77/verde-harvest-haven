
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VarietyList from "./VarietyList";
import SessionManager from "@/components/session/SessionManager";

const VarietyManagementTabs = () => {
  return (
    <Tabs defaultValue="varieties" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="varieties">Variétés</TabsTrigger>
        <TabsTrigger value="sessions">Sessions de culture</TabsTrigger>
      </TabsList>
      
      <TabsContent value="varieties">
        <VarietyList />
      </TabsContent>
      
      <TabsContent value="sessions">
        <SessionManager />
      </TabsContent>
    </Tabs>
  );
};

export default VarietyManagementTabs;
