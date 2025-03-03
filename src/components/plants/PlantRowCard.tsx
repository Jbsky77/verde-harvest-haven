
import { Plant } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PlantRowHeader from "./PlantRowHeader";
import PlantRowTable from "./PlantRowTable";

interface PlantRowCardProps {
  row: number;
  plants: Plant[];
  isExpanded: boolean;
  toggleRow: (row: number) => void;
  onPlantClick: (plant: Plant) => void;
}

const PlantRowCard = ({ 
  row, 
  plants, 
  isExpanded, 
  toggleRow,
  onPlantClick
}: PlantRowCardProps) => {
  return (
    <Card key={row} className="overflow-hidden animate-fade-in">
      <CardHeader className="p-0">
        <PlantRowHeader 
          row={row} 
          plants={plants} 
          isExpanded={isExpanded} 
          onToggle={() => toggleRow(row)} 
        />
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-0">
          <PlantRowTable 
            plants={plants} 
            onPlantClick={onPlantClick} 
          />
        </CardContent>
      )}
    </Card>
  );
};

export default PlantRowCard;
