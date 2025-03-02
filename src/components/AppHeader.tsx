
import { 
  Bell, 
  Menu, 
  Search, 
  User,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCultivation } from "@/context/CultivationContext";
import AlertPanel from "@/components/AlertPanel";

const AppHeader = () => {
  const { alerts } = useCultivation();
  const [alertsOpen, setAlertsOpen] = useState(false);
  const unreadAlerts = alerts.filter(alert => !alert.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-lg bg-white/80 h-16 flex items-center px-4 md:px-8">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-semibold text-lg">Menu</h2>
                  <X className="h-4 w-4 text-muted-foreground" />
                </div>
                <nav className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map((spaceId) => (
                    <Button
                      key={spaceId}
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      Espace {spaceId}
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center">
            <h1 className="text-xl font-medium mr-2">CBD Harvest</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Aéroponie
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Search className="h-5 w-5" />
          </Button>
          
          <Sheet open={alertsOpen} onOpenChange={setAlertsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadAlerts > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive" 
                    variant="destructive"
                  >
                    {unreadAlerts}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md p-0">
              <AlertPanel onClose={() => setAlertsOpen(false)} />
            </SheetContent>
          </Sheet>
          
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
