
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";

interface SessionProgressBarProps {
  progressPercent: number;
  elapsedDays: number;
  totalDuration: number;
  daysRemaining: number;
}

export const SessionProgressBar = ({
  progressPercent,
  elapsedDays,
  totalDuration,
  daysRemaining
}: SessionProgressBarProps) => {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-green-800">Progression de la session</span>
        <Badge variant="outline" className="bg-white text-green-800">
          {progressPercent}%
        </Badge>
      </div>
      <Progress value={progressPercent} className="h-2" />
      <div className="flex items-center justify-between mt-1 text-xs text-green-800">
        <span>Jour {Math.floor(elapsedDays)}/{Math.ceil(totalDuration)}</span>
        <div className="flex items-center">
          <Timer className="h-3 w-3 mr-1" />
          <span>{daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};
