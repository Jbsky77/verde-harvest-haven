
import { useState } from "react";
import { Plant, CultivationSpace } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import PlantRowItem from "./PlantRowItem";

type PlantRowProps = {
  row: number;
  plants: Plant[];
  isExpanded: boolean;
  onToggle: () => void;
  onPlantClick: (plant: Plant) => void;
};

const PlantRow = ({ row, plants, isExpanded, onToggle, onPlantClick }: PlantRowProps) => {
  return (
    <Card key={row} className="overflow-hidden animate-fade-in">
      <CardHeader 
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
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-0">
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
                  <PlantRowItem 
                    key={plant.id} 
                    plant={plant} 
                    onPlantClick={onPlantClick} 
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PlantRow;
