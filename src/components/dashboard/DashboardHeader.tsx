
import { Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCultivation } from "@/context/CultivationContext";

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
  
  return (
    <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Gestion de votre culture en aéroponie
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-all-spaces"
              checked={showAllSpaces}
              onCheckedChange={setShowAllSpaces}
            />
            <Label htmlFor="show-all-spaces" className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              Afficher tous les espaces
            </Label>
          </div>
          
          <Button 
            onClick={onNewSessionClick} 
            disabled={currentSession?.isActive}
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
