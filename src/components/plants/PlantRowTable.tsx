
import { Plant } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { stateColors, stateLabels } from "./constants";

interface PlantRowTableProps {
  plants: Plant[];
  onPlantClick: (plant: Plant) => void;
}

const PlantRowTable = ({ plants, onPlantClick }: PlantRowTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Position</TableHead>
            <TableHead>Variété</TableHead>
            <TableHead>État</TableHead>
            <TableHead>EC</TableHead>
            <TableHead>pH</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plants.map(plant => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlantRowTable;
