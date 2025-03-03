
import { Label } from "@/components/ui/label";

type EstimatedDatesProps = {
  floweringDate: Date | null;
  harvestDate: Date | null;
  formatDate: (date: Date | null) => string;
};

export const EstimatedDates = ({ 
  floweringDate, 
  harvestDate, 
  formatDate 
}: EstimatedDatesProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 pt-2">
      <div>
        <Label className="text-sm text-muted-foreground">Floraison estimée</Label>
        <p className="text-sm font-medium">{formatDate(floweringDate)}</p>
      </div>
      <div>
        <Label className="text-sm text-muted-foreground">Récolte estimée</Label>
        <p className="text-sm font-medium">{formatDate(harvestDate)}</p>
      </div>
    </div>
  );
};
