
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PlayIcon } from "lucide-react";
import { useCultivation } from "@/context/CultivationContext";

interface DashboardHeaderProps {
  showAllSpaces: boolean;
  setShowAllSpaces: (value: boolean) => void;
  onNewSessionClick: () => void;
}

const DashboardHeader = ({ 
  showAllSpaces, 
  setShowAllSpaces, 
  onNewSessionClick 
}: DashboardHeaderProps) => {
  const { currentSession } = useCultivation();

  return (
    <div className="px-6 pt-6 flex justify-between items-center">
      <Button 
        onClick={onNewSessionClick}
        variant="success"
        className="flex items-center gap-2"
        disabled={!!currentSession?.isActive}
      >
        <PlayIcon size={16} />
        Démarrer une nouvelle session
      </Button>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="show-all-spaces"
          checked={showAllSpaces}
          onCheckedChange={setShowAllSpaces}
        />
        <Label htmlFor="show-all-spaces">Afficher tous les espaces</Label>
      </div>
    </div>
  );
};

export default DashboardHeader;
