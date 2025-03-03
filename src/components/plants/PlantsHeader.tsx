
import { Button } from "@/components/ui/button";
import { Filter, Leaf } from "lucide-react";

interface PlantsHeaderProps {
  spaceName: string;
}

const PlantsHeader = ({ spaceName }: PlantsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Leaf className="h-5 w-5 text-primary" />
        Plantes de l'espace {spaceName}
      </h2>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Filter className="h-4 w-4" />
        Filtres
      </Button>
    </div>
  );
};

export default PlantsHeader;
