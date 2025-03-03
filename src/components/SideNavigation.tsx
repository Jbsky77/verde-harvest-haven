
import { useState } from "react";
import { 
  Home, 
  Grid3X3, 
  BarChart3, 
  Droplet, 
  Sprout, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCultivation } from "@/context/CultivationContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  collapsed: boolean;
};

const NavItem = ({ icon, label, to, active, collapsed }: NavItemProps) => {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 mb-1",
        collapsed ? "px-3" : "px-4"
      )}
      asChild
    >
      <Link to={to}>
        {icon}
        {!collapsed && <span>{label}</span>}
      </Link>
    </Button>
  );
};

type SpaceItemProps = {
  spaceId: number;
  label: string;
  onClick: () => void;
  active: boolean;
  collapsed: boolean;
};

const SpaceItem = ({ spaceId, label, onClick, active, collapsed }: SpaceItemProps) => {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 mb-1",
        collapsed ? "px-3" : "px-4"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-5 h-5">
        <span className="text-xs font-medium">{spaceId}</span>
      </div>
      {!collapsed && <span>{label}</span>}
    </Button>
  );
};

const SideNavigation = () => {
  const { selectedSpaceId, setSelectedSpaceId, spaces } = useCultivation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  
  // On mobile, always show expanded sidebar
  const isCollapsed = isMobile ? false : collapsed;

  if (isMobile) return null;

  const getActivePage = () => {
    if (currentPath === "/") return "home";
    if (currentPath === "/spaces") return "spaces";
    if (currentPath === "/analytics") return "analytics";
    if (currentPath === "/fertilizers") return "fertilizers";
    if (currentPath === "/plants") return "plants";
    if (currentPath === "/settings") return "settings";
    return "spaces"; // default
  };

  const page = getActivePage();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 bottom-0 border-r bg-white transition-all duration-300 ease-in-out overflow-hidden z-40 flex flex-col",
        isCollapsed ? "w-14" : "w-56"
      )}
    >
      <div className="flex flex-col p-2 flex-1">
        <NavItem
          icon={<Home className="h-5 w-5" />}
          label="Accueil"
          to="/"
          active={page === "home"}
          collapsed={isCollapsed}
        />
        <NavItem
          icon={<Grid3X3 className="h-5 w-5" />}
          label="Espaces"
          to="/spaces"
          active={page === "spaces"}
          collapsed={isCollapsed}
        />
        <NavItem
          icon={<BarChart3 className="h-5 w-5" />}
          label="Analyses"
          to="/analytics"
          active={page === "analytics"}
          collapsed={isCollapsed}
        />
        <NavItem
          icon={<Droplet className="h-5 w-5" />}
          label="Fertilisants"
          to="/fertilizers"
          active={page === "fertilizers"}
          collapsed={isCollapsed}
        />
        <NavItem
          icon={<Sprout className="h-5 w-5" />}
          label="Variétés"
          to="/plants"
          active={page === "plants"}
          collapsed={isCollapsed}
        />
        <NavItem
          icon={<Settings className="h-5 w-5" />}
          label="Paramètres"
          to="/settings"
          active={page === "settings"}
          collapsed={isCollapsed}
        />

        {page === "spaces" && (
          <div className="mt-4">
            <div className={cn("mb-2 px-2", isCollapsed && "text-center")}>
              {!isCollapsed && <p className="text-xs font-medium text-muted-foreground">ESPACES</p>}
            </div>
            {spaces.map((space) => (
              <SpaceItem
                key={space.id}
                spaceId={space.id}
                label={space.name}
                onClick={() => setSelectedSpaceId(space.id)}
                active={selectedSpaceId === space.id}
                collapsed={isCollapsed}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
};

export default SideNavigation;
