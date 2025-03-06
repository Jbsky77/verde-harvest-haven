
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Seedling, Flower } from "lucide-react";
import { CultivationSpace, RoomType } from "@/types";
import { cn } from "@/lib/utils";

type SpaceNavigationProps = {
  spaces: CultivationSpace[];
  currentSpace: CultivationSpace;
  onNavigate: (spaceId: number) => void;
};

const SpaceNavigation = ({ spaces, currentSpace, onNavigate }: SpaceNavigationProps) => {
  // Filter spaces by the current room type
  const roomType = currentSpace.roomType;
  const roomSpaces = spaces.filter(space => space.roomType === roomType);
  
  const currentIndex = roomSpaces.findIndex(s => s.id === currentSpace.id);
  
  const nextSpace = () => {
    const nextIndex = (currentIndex + 1) % roomSpaces.length;
    onNavigate(roomSpaces[nextIndex].id);
  };

  const prevSpace = () => {
    const prevIndex = (currentIndex - 1 + roomSpaces.length) % roomSpaces.length;
    onNavigate(roomSpaces[prevIndex].id);
  };
  
  const RoomIcon = roomType === "growth" ? Seedling : Flower;
  const roomLabel = roomType === "growth" ? "Croissance" : "Floraison";

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <RoomIcon className={cn(
          "h-5 w-5",
          roomType === "growth" ? "text-green-600" : "text-purple-600"
        )} />
        <span className="font-medium">Salle de {roomLabel}</span>
      </div>
      
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
          {roomSpaces.map(s => (
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
    </div>
  );
};

export default SpaceNavigation;
