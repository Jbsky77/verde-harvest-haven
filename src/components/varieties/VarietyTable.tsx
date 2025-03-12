
import { useState } from "react";
import { PlantVariety } from "@/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface VarietyTableProps {
  varieties: PlantVariety[];
  onEdit: (variety: PlantVariety) => void;
  onDelete: (varietyId: string, name: string) => void;
}

const VarietyTable = ({ varieties, onEdit, onDelete }: VarietyTableProps) => {
  const { t } = useTranslation();
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={{ width: "50px" }}>{t('common.color')}</TableHead>
          <TableHead>{t('varieties.name')}</TableHead>
          <TableHead className="text-right">{t('varieties.germinationTime')}</TableHead>
          <TableHead className="text-right">{t('varieties.growthTime')}</TableHead>
          <TableHead className="text-right">{t('varieties.floweringTime')}</TableHead>
          <TableHead className="text-right">{t('varieties.dryWeight')}</TableHead>
          <TableHead style={{ width: "100px" }}>{t('common.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {varieties.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
              {t('varieties.empty')}
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
              <TableCell className="font-medium">{variety.name}</TableCell>
              <TableCell className="text-right">{variety.germinationTime || "-"}</TableCell>
              <TableCell className="text-right">{variety.growthTime || "-"}</TableCell>
              <TableCell className="text-right">{variety.floweringTime || "-"}</TableCell>
              <TableCell className="text-right">{variety.dryWeight ? `${variety.dryWeight} g` : "-"}</TableCell>
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
                    onClick={() => onDelete(variety.id, variety.name)}
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
