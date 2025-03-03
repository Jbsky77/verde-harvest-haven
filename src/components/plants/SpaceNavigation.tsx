
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CultivationSpace } from "@/types";

interface SpaceNavigationProps {
  space: CultivationSpace;
  spaces: CultivationSpace[];
  navigateToSpace: (spaceId: number) => void;
  prevSpace: () => void;
  nextSpace: () => void;
}

const SpaceNavigation = ({ 
  space, 
  spaces, 
  navigateToSpace, 
  prevSpace, 
  nextSpace 
}: SpaceNavigationProps) => {
  return (
    <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={prevSpace}
        className="flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Espace précédent
      </Button>
      
      <div className="flex gap-2">
        {spaces.map(s => (
          <Button
            key={s.id}
            variant={s.id === space.id ? "default" : "outline"}
            size="sm"
            onClick={() => navigateToSpace(s.id)}
            className="min-w-10"
          >
            {s.id}
          </Button>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={nextSpace}
        className="flex items-center gap-1"
      >
        Espace suivant
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SpaceNavigation;
