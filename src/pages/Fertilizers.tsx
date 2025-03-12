import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useCultivation } from "@/context/CultivationContext";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import SideNavigation from "@/components/SideNavigation";
import { cn } from "@/lib/utils";

const Fertilizers = () => {
  const { 
    fertilizers, 
    addFertilizer, 
    updateFertilizer, 
    deleteFertilizer,
    getFertilizerById
  } = useCultivation();
  
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFertilizer, setSelectedFertilizer] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [npk, setNpk] = useState("");
  const [color, setColor] = useState("#7e22ce");

  const handleAddFertilizer = () => {
    setIsEditing(false);
    setSelectedFertilizer(null);
    setName("");
    setDescription("");
    setNpk("");
    setColor("#7e22ce");
    setOpen(true);
  };

  const handleEditFertilizer = (id: string) => {
    const fertilizer = getFertilizerById(id);
    if (fertilizer) {
      setIsEditing(true);
      setSelectedFertilizer(fertilizer);
      setName(fertilizer.name);
      setDescription(fertilizer.description || "");
      setNpk(fertilizer.npk);
      setColor(fertilizer.color);
      setOpen(true);
    }
  };

  const handleDeleteFertilizer = (id: string) => {
    deleteFertilizer(id);
  };

  const handleSubmit = () => {
    if (!name || !npk) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const newFertilizer = {
      name,
      description,
      npk,
      color,
    };

    if (isEditing && selectedFertilizer) {
      updateFertilizer({ ...selectedFertilizer, ...newFertilizer });
      toast({
        title: "Succès",
        description: "Engrais mis à jour avec succès.",
      });
    } else {
      addFertilizer(newFertilizer);
      toast({
        title: "Succès",
        description: "Engrais ajouté avec succès.",
      });
    }

    setOpen(false);
  };

  return (
    <>
      <SideNavigation />
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('fertilizers.title')}</h1>
          <Button onClick={handleAddFertilizer}>
            <Plus className="w-4 h-4 mr-2" />
            {t('fertilizers.addFertilizer')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('fertilizers.fertilizerList')}</CardTitle>
            <CardDescription>{t('fertilizers.manageFertilizers')}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('fertilizers.name')}</TableHead>
                  <TableHead>{t('fertilizers.description')}</TableHead>
                  <TableHead>{t('fertilizers.npk')}</TableHead>
                  <TableHead>{t('fertilizers.color')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fertilizers.map((fertilizer) => (
                  <TableRow key={fertilizer.id}>
                    <TableCell className="font-medium">{fertilizer.name}</TableCell>
                    <TableCell>{fertilizer.description}</TableCell>
                    <TableCell>{fertilizer.npk}</TableCell>
                    <TableCell>
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: fertilizer.color }}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditFertilizer(fertilizer.id)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleDeleteFertilizer(fertilizer.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? t('fertilizers.editFertilizer') : t('fertilizers.addFertilizer')}</DialogTitle>
              <DialogDescription>{t('fertilizers.manageFertilizerDetails')}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  {t('fertilizers.name')}
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  {t('fertilizers.description')}
                </Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="npk" className="text-right">
                  {t('fertilizers.npk')}
                </Label>
                <Input id="npk" value={npk} onChange={(e) => setNpk(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  {t('fertilizers.color')}
                </Label>
                <Input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="col-span-3 h-10"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
                {t('common.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Fertilizers;
