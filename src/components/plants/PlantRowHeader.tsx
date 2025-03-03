
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Plant } from "@/types";

interface PlantRowHeaderProps {
  row: number;
  plants: Plant[];
  isExpanded: boolean;
  onToggle: () => void;
}

const PlantRowHeader = ({ 
  row, 
  plants, 
  isExpanded, 
  onToggle 
}: PlantRowHeaderProps) => {
  return (
    <div
      className={cn(
        "py-3 px-4 cursor-pointer transition-colors flex flex-row items-center justify-between",
        isExpanded ? "bg-accent" : "hover:bg-muted/50"
      )}
      onClick={onToggle}
    >
      <CardTitle className="text-base font-medium flex items-center gap-2">
        Ligne {row}
        <Badge variant="outline" className="ml-2 bg-primary bg-opacity-10">
          {plants.length} plantes
        </Badge>
      </CardTitle>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        {isExpanded ? 
          <ChevronUp className="h-4 w-4" /> : 
          <ChevronDown className="h-4 w-4" />
        }
      </Button>
    </div>
  );
};

export default PlantRowHeader;
