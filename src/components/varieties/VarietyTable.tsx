
import { PlantVariety } from "@/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VarietyTableProps {
  varieties: PlantVariety[];
  currentSessionVarieties: string[];
  onEdit: (variety: PlantVariety) => void;
  onDelete: (variety: PlantVariety) => void;
}

const VarietyTable = ({ varieties, currentSessionVarieties, onEdit, onDelete }: VarietyTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Couleur</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead className="text-right">Germination (j)</TableHead>
          <TableHead className="text-right">Croissance (j)</TableHead>
          <TableHead className="text-right">Floraison (j)</TableHead>
          <TableHead className="text-right">Poids sec (g)</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {varieties.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
              Aucune variété trouvée
            </TableCell>
          </TableRow>
        ) : (
          varieties.map((variety) => (
            <TableRow key={variety.id}>
              <TableCell>
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: variety.color }} 
                />
              </TableCell>
              <TableCell>
                {variety.name}
                {currentSessionVarieties.includes(variety.id) && (
                  <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                    Session en cours
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">{variety.germinationTime || "-"}</TableCell>
              <TableCell className="text-right">{variety.growthTime || "-"}</TableCell>
              <TableCell className="text-right">{variety.floweringTime || "-"}</TableCell>
              <TableCell className="text-right">{variety.dryWeight || "-"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(variety)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(variety)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default VarietyTable;
