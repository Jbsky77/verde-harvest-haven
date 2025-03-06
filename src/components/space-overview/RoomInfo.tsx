
import { Flower, Sprout } from "lucide-react";
import { RoomType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RoomInfoProps = {
  roomType: RoomType;
  spaceCount: number;
  plantCount: number;
};

export const RoomInfo = ({ roomType, spaceCount, plantCount }: RoomInfoProps) => {
  const isGrowthRoom = roomType === "growth";
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isGrowthRoom ? (
            <>
              <Sprout className="h-5 w-5 text-green-600" />
              Salle de Croissance
            </>
          ) : (
            <>
              <Flower className="h-5 w-5 text-purple-600" />
              Salle de Floraison
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Espaces</p>
            <p className="text-2xl font-semibold">{spaceCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Plants</p>
            <p className="text-2xl font-semibold">{plantCount}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Configuration</p>
            {isGrowthRoom ? (
              <p className="text-sm">3 espaces de 12 bacs (100 plants/bac)</p>
            ) : (
              <p className="text-sm">6 espaces de 4 rangées (143 plants/rangée)</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
