
import { Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCultivation } from "@/context/CultivationContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface DashboardHeaderProps {
  showAllSpaces: boolean;
  setShowAllSpaces: (show: boolean) => void;
  onNewSessionClick: () => void;
}

const DashboardHeader = ({ 
  showAllSpaces, 
  setShowAllSpaces, 
  onNewSessionClick 
}: DashboardHeaderProps) => {
  const { currentSession } = useCultivation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className={`bg-white border-b ${isMobile ? 'px-3 py-3' : 'px-6 py-4'} sticky top-0 z-10`}>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold tracking-tight`}>Tableau de bord</h1>
          {!isMobile && (
            <p className="text-muted-foreground">
              Gestion de votre culture en aéroponie
            </p>
          )}
        </div>
        
        <div className={`flex flex-wrap items-center gap-4 ${isMobile ? 'w-full justify-between mt-2' : ''}`}>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-all-spaces"
              checked={showAllSpaces}
              onCheckedChange={setShowAllSpaces}
            />
            <Label htmlFor="show-all-spaces" className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              {isMobile ? "Tous" : "Afficher tous les espaces"}
            </Label>
          </div>
          
          <Button 
            onClick={onNewSessionClick} 
            disabled={currentSession?.isActive}
            size={isMobile ? "sm" : "default"}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-1" />
            {isMobile ? "Session" : "Nouvelle session"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
