
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import VarietyManagement from "@/components/VarietyManagement";
import SideNavigation from "@/components/SideNavigation";

const Varieties = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SideNavigation />
      
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">{t('common.varieties')}</h1>
        
        <Card>
          <CardContent className="pt-6">
            <VarietyManagement />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Varieties;
