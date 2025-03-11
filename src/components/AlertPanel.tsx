
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useCultivation } from "@/context/cultivationContext";
import { Alert as AlertType } from "@/types";
import { format } from "date-fns";
import { AlertCircle, AlertTriangle, CheckCircle, Info, Trash2, X } from "lucide-react";

type AlertItemProps = {
  alert: AlertType;
  onMarkAsRead: (id: string) => void;
};

const AlertItem = ({ alert, onMarkAsRead }: AlertItemProps) => {
  const { type, message, timestamp, read, id } = alert;
  
  const iconMap = {
    info: <Info className="h-5 w-5 text-primary" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning" />,
    error: <AlertCircle className="h-5 w-5 text-destructive" />,
    success: <CheckCircle className="h-5 w-5 text-success" />
  };
  
  return (
    <div 
      className={`p-4 border-b last:border-b-0 flex gap-3 ${read ? 'opacity-70' : 'opacity-100'}`}
      onClick={() => !read && onMarkAsRead(id)}
    >
      <div className="shrink-0 mt-1">
        {iconMap[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {format(new Date(timestamp), 'HH:mm - dd/MM/yyyy')}
        </p>
      </div>
      {!read && (
        <div className="shrink-0">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
};

type AlertPanelProps = {
  onClose: () => void;
};

const AlertPanel = ({ onClose }: AlertPanelProps) => {
  const { alerts, markAlertAsRead, clearAllAlerts } = useCultivation();
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-medium">Notifications</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={clearAllAlerts}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Tout effacer
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {alerts.length > 0 ? (
          <div>
            {alerts.map(alert => (
              <AlertItem 
                key={alert.id} 
                alert={alert} 
                onMarkAsRead={markAlertAsRead} 
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>Aucune notification</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default AlertPanel;
