
import { Plant } from "@/types";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the state label constants
const stateLabels = {
  germination: "Germination",
  growth: "Croissance",
  flowering: "Floraison",
  drying: "Séchage",
  harvested: "Récolté"
};

// Define the state color constants
const stateColors = {
  germination: "bg-purple-100 text-purple-800 border-purple-200",
  growth: "bg-blue-100 text-blue-800 border-blue-200",
  flowering: "bg-pink-100 text-pink-800 border-pink-200",
  drying: "bg-orange-100 text-orange-800 border-orange-200",
  harvested: "bg-green-100 text-green-800 border-green-200"
};

type PlantRowItemProps = {
  plant: Plant;
  onPlantClick: (plant: Plant) => void;
};

const PlantRowItem = ({ plant, onPlantClick }: PlantRowItemProps) => {
  return (
    <TableRow 
      key={plant.id} 
      className="hover:bg-muted/30 transition-colors"
    >
      <TableCell className="font-mono text-xs">
        L{plant.position.row} - C{plant.position.column}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: plant.variety.color }} 
          />
          <span className="font-medium">{plant.variety.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn("transition-colors", stateColors[plant.state])}>
          {stateLabels[plant.state]}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">{plant.ec.toFixed(2)}</TableCell>
      <TableCell className="font-medium">{plant.ph.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-primary/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onPlantClick(plant);
          }}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default PlantRowItem;
