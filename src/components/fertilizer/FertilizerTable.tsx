
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fertilizer } from "@/types";
import { FertilizerTypeLabels } from "./FertilizerForm";

interface FertilizerTableProps {
  fertilizers: Fertilizer[];
  onEdit: (fertilizer: Fertilizer) => void;
  onDelete: (id: string, name: string) => void;
}

const FertilizerTable = ({ fertilizers, onEdit, onDelete }: FertilizerTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Couleur</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead className="w-20">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fertilizers.map((fertilizer) => (
          <TableRow key={fertilizer.id}>
            <TableCell>
              <div 
                className="w-6 h-6 rounded-full" 
                style={{ backgroundColor: fertilizer.color || '#9b87f5' }} 
              />
            </TableCell>
            <TableCell>{fertilizer.name}</TableCell>
            <TableCell>{FertilizerTypeLabels[fertilizer.type]}</TableCell>
            <TableCell>{fertilizer.recommendedDosage.toFixed(2)} {fertilizer.unitType}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(fertilizer)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(fertilizer.id, fertilizer.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FertilizerTable;
