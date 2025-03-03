
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CultivationSpace } from "@/types";

type SpaceNavigationProps = {
  spaces: CultivationSpace[];
  currentSpace: CultivationSpace;
  onNavigate: (spaceId: number) => void;
};

const SpaceNavigation = ({ spaces, currentSpace, onNavigate }: SpaceNavigationProps) => {
  const currentIndex = spaces.findIndex(s => s.id === currentSpace.id);
  
  const nextSpace = () => {
    const nextIndex = (currentIndex + 1) % spaces.length;
    onNavigate(spaces[nextIndex].id);
  };

  const prevSpace = () => {
    const prevIndex = (currentIndex - 1 + spaces.length) % spaces.length;
    onNavigate(spaces[prevIndex].id);
  };

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
            variant={s.id === currentSpace.id ? "default" : "outline"}
            size="sm"
            onClick={() => onNavigate(s.id)}
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
