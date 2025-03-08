
import { Flower, Sprout } from "lucide-react";
import { RoomType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type RoomInfoProps = {
  roomType: RoomType;
  spaceCount: number;
  plantCount: number;
};

export const RoomInfo = ({ roomType, spaceCount, plantCount }: RoomInfoProps) => {
  const isGrowthRoom = roomType === "growth";
  const { t } = useTranslation();
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isGrowthRoom ? (
            <>
              <Sprout className="h-5 w-5 text-green-600" />
              {t('rooms.growth.title')}
            </>
          ) : (
            <>
              <Flower className="h-5 w-5 text-purple-600" />
              {t('rooms.flowering.title')}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t('rooms.growth.spaces')}</p>
            <p className="text-2xl font-semibold">{spaceCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t('rooms.growth.plants')}</p>
            <p className="text-2xl font-semibold">{plantCount}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">{t('common.settings')}</p>
            {isGrowthRoom ? (
              <p className="text-sm">{t('rooms.growth.configuration')}</p>
            ) : (
              <p className="text-sm">{t('rooms.flowering.configuration')}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
