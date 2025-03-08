
import { 
  Home, 
  Grid3X3, 
  BarChart3, 
  Droplet, 
  Sprout, 
  Settings,
  ChevronDown,
  Flower
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCultivation } from "@/context/CultivationContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomType } from "@/types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
};

const NavItem = ({ icon, label, to, active }: NavItemProps) => {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "h-10 gap-2",
        active ? "bg-gray-100" : ""
      )}
      asChild
    >
      <Link to={to}>
        {icon}
        <span className="text-sm">{label}</span>
      </Link>
    </Button>
  );
};

type SpaceItemProps = {
  spaceId: number;
  label: string;
  onClick: () => void;
  active: boolean;
};

const SpaceItem = ({ spaceId, label, onClick, active }: SpaceItemProps) => {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "h-9 gap-2 mb-1 w-full justify-start",
        active ? "bg-gray-100" : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-5 h-5">
        <span className="text-xs font-medium">{spaceId}</span>
      </div>
      <span>{label}</span>
    </Button>
  );
};

const SideNavigation = () => {
  const { 
    selectedSpaceId, 
    setSelectedSpaceId, 
    spaces, 
    selectedRoomType, 
    setSelectedRoomType,
    getSpacesByRoomType
  } = useCultivation();
  
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const getActivePage = () => {
    if (currentPath === "/") return "home";
    if (currentPath === "/spaces" || currentPath.startsWith("/spaces")) return "spaces";
    if (currentPath === "/analytics" || currentPath.startsWith("/analytics")) return "analytics";
    if (currentPath === "/fertilizers" || currentPath.startsWith("/fertilizers")) return "fertilizers";
    if (currentPath === "/plants" || currentPath.startsWith("/plants")) return "plants";
    if (currentPath === "/settings" || currentPath.startsWith("/settings")) return "settings";
    return "spaces"; // default
  };

  const page = getActivePage();
  
  const filteredSpaces = getSpacesByRoomType(selectedRoomType);

  const handleRoomTypeChange = (value: string) => {
    const roomType = value as RoomType;
    setSelectedRoomType(roomType);
    
    const firstSpace = getSpacesByRoomType(roomType)[0];
    if (firstSpace) {
      setSelectedSpaceId(firstSpace.id);
    }
  };

  // When a space is selected, ensure we're on the spaces page
  const handleSpaceSelect = (spaceId: number) => {
    setSelectedSpaceId(spaceId);
    if (currentPath !== "/spaces") {
      navigate("/spaces");
    }
  };

  // Update space selection when filtered spaces change
  useEffect(() => {
    if (filteredSpaces.length > 0 && !selectedSpaceId) {
      setSelectedSpaceId(filteredSpaces[0].id);
    }
  }, [filteredSpaces, selectedSpaceId, setSelectedSpaceId]);

  return (
    <header className="w-full bg-white border-b shadow-sm z-40 sticky top-0">
      <div className="container mx-auto">
        <div className="flex items-center h-16">
          <nav className="flex space-x-1 overflow-x-auto hide-scrollbar">
            <NavItem
              icon={<Home className="h-4 w-4" />}
              label={t('common.home')}
              to="/"
              active={page === "home"}
            />
            <NavItem
              icon={<Grid3X3 className="h-4 w-4" />}
              label={t('common.spaces')}
              to="/spaces"
              active={page === "spaces"}
            />
            <NavItem
              icon={<BarChart3 className="h-4 w-4" />}
              label={t('common.analytics')}
              to="/analytics"
              active={page === "analytics"}
            />
            <NavItem
              icon={<Droplet className="h-4 w-4" />}
              label={t('common.fertilizers')}
              to="/fertilizers"
              active={page === "fertilizers"}
            />
            <NavItem
              icon={<Sprout className="h-4 w-4" />}
              label={t('common.varieties')}
              to="/plants"
              active={page === "plants"}
            />
            <NavItem
              icon={<Settings className="h-4 w-4" />}
              label={t('common.settings')}
              to="/settings"
              active={page === "settings"}
            />
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            
            {(page === "spaces" || page === "analytics") && (
              <div className="flex items-center gap-4">
                <Tabs 
                  value={selectedRoomType} 
                  onValueChange={handleRoomTypeChange}
                  className="bg-gray-100 rounded-md p-1"
                >
                  <TabsList>
                    <TabsTrigger value="growth" className="flex items-center gap-2">
                      <Sprout className="h-4 w-4" />
                      <span className="hidden sm:inline">{t('common.growthRoom')}</span>
                      <span className="sm:hidden">{t('common.growth')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="flowering" className="flex items-center gap-2">
                      <Flower className="h-4 w-4" />
                      <span className="hidden sm:inline">{t('common.floweringRoom')}</span>
                      <span className="sm:hidden">{t('common.flowering')}</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      {t('common.spaces')}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-48 p-2">
                    <div className="space-y-1">
                      {filteredSpaces.map((space) => (
                        <SpaceItem
                          key={space.id}
                          spaceId={space.id}
                          label={space.name}
                          onClick={() => handleSpaceSelect(space.id)}
                          active={selectedSpaceId === space.id}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SideNavigation;
