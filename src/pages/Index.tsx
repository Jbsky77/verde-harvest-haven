
import AppHeader from "@/components/AppHeader";
import SideNavigation from "@/components/SideNavigation";
import Dashboard from "@/components/Dashboard";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-hidden">
      <AppHeader />
      <div className="flex flex-1 mt-16">
        <SideNavigation />
        <main className={`flex-1 ${isMobile ? "w-full" : "ml-14 md:ml-56"} bg-white transition-all duration-300 ease-in-out overflow-y-auto`}>
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Index;
