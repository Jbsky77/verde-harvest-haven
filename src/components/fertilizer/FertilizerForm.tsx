
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fertilizer, FertilizerType } from "@/types";
import { useTranslation } from "react-i18next";

interface FertilizerFormProps {
  name: string;
  setName: (name: string) => void;
  type: FertilizerType;
  setType: (type: FertilizerType) => void;
  unitType: "ml/L" | "g/L";
  setUnitType: (unitType: "ml/L" | "g/L") => void;
  recommendedDosage: string;
  setRecommendedDosage: (dosage: string) => void;
  color: string;
  setColor: (color: string) => void;
}

export const FertilizerTypeLabels: Record<FertilizerType, string> = {
  base: "Base",
  growth: "Croissance",
  bloom: "Floraison",
  booster: "Booster",
  custom: "Personnalisé"
};

const FertilizerForm = ({
  name,
  setName,
  type,
  setType,
  unitType,
  setUnitType,
  recommendedDosage,
  setRecommendedDosage,
  color,
  setColor
}: FertilizerFormProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('fertilizers.name')}</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={e => setName(e.target.value)}
          placeholder="ex: Stimulateur racinaire"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">{t('fertilizers.type')}</Label>
        <Select 
          value={type} 
          onValueChange={(value) => setType(value as FertilizerType)}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="base">{t('fertilizers.types.base')}</SelectItem>
            <SelectItem value="growth">{t('fertilizers.types.growth')}</SelectItem>
            <SelectItem value="bloom">{t('fertilizers.types.bloom')}</SelectItem>
            <SelectItem value="booster">{t('fertilizers.types.booster')}</SelectItem>
            <SelectItem value="custom">{t('fertilizers.types.custom')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dosage">{t('fertilizers.dosage')}</Label>
          <Input 
            id="dosage" 
            type="number"
            step="0.01"
            min="0.01"
            value={recommendedDosage}
            onChange={e => setRecommendedDosage(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit">{t('fertilizers.unit')}</Label>
          <Select 
            value={unitType} 
            onValueChange={(value) => setUnitType(value as "ml/L" | "g/L")}
          >
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ml/L">ml/L</SelectItem>
              <SelectItem value="g/L">g/L</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="color">{t('fertilizers.color')}</Label>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full border border-gray-200" 
            style={{ backgroundColor: color }} 
          />
          <Input
            id="color"
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="w-20 h-10 p-1"
          />
        </div>
      </div>
    </div>
  );
};

export default FertilizerForm;
