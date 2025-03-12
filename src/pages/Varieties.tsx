
import { useState } from "react";
import { useCultivation } from "@/context/CultivationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { PlantVariety } from "@/types";
import { useTranslation } from "react-i18next";
import { VarietyTable, VarietyDialog } from "@/components/varieties";

const VarietiesPage = () => {
  const { varieties, addVariety, updateVariety, deleteVariety } = useCultivation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVariety, setCurrentVariety] = useState<PlantVariety | null>(null);
  const { t } = useTranslation();

  const openDialog = (variety?: PlantVariety) => {
    if (variety) {
      setCurrentVariety(variety);
      setIsEditing(true);
    } else {
      setCurrentVariety(null);
      setIsEditing(false);
    }
    
    setIsDialogOpen(true);
  };

  const handleSubmit = (varietyData: Omit<PlantVariety, "id">) => {
    try {
      if (isEditing && currentVariety) {
        updateVariety({
          ...currentVariety,
          ...varietyData
        });
        toast.success(t('varieties.updated', { name: varietyData.name }));
      } else {
        addVariety(varietyData);
        toast.success(t('varieties.created', { name: varietyData.name }));
      }

      setIsDialogOpen(false);
      setCurrentVariety(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving variety:", error);
      toast.error(t('varieties.error'));
    }
  };

  const handleDelete = (varietyId: string, name: string) => {
    if (confirm(t('varieties.confirmDelete', { name }))) {
      deleteVariety(varietyId);
      toast.success(t('varieties.deleted', { name }));
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <Card className="shadow-md">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary">{t('common.varieties')}</CardTitle>
            <Button onClick={() => openDialog()} className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('varieties.add')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <VarietyTable 
            varieties={varieties}
            onEdit={openDialog}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <VarietyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        currentVariety={currentVariety}
        isEditing={isEditing}
      />
    </div>
  );
};

export default VarietiesPage;
