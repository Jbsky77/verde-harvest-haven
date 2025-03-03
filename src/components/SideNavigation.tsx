
import { useState } from "react";
import { 
  Home, 
  Grid3X3, 
  BarChart3, 
  Droplet, 
  Sprout, 
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCultivation } from "@/context/CultivationContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const { selectedSpaceId, setSelectedSpaceId, spaces } = useCultivation();
  const isMobile = useIsMobile();
  const location = useLocation();
  const currentPath = location.pathname;
  
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
    <header className="w-full bg-white border-b shadow-sm z-40 sticky top-0">
      <div className="container mx-auto">
        <div className="flex items-center h-16">
          <nav className="flex space-x-1 overflow-x-auto hide-scrollbar">
            <NavItem
              icon={<Home className="h-4 w-4" />}
              label="Accueil"
              to="/"
              active={page === "home"}
            />
            <NavItem
              icon={<Grid3X3 className="h-4 w-4" />}
              label="Espaces"
              to="/spaces"
              active={page === "spaces"}
            />
            <NavItem
              icon={<BarChart3 className="h-4 w-4" />}
              label="Analyses"
              to="/analytics"
              active={page === "analytics"}
            />
            <NavItem
              icon={<Droplet className="h-4 w-4" />}
              label="Fertilisants"
              to="/fertilizers"
              active={page === "fertilizers"}
            />
            <NavItem
              icon={<Sprout className="h-4 w-4" />}
              label="Variétés"
              to="/plants"
              active={page === "plants"}
            />
            <NavItem
              icon={<Settings className="h-4 w-4" />}
              label="Paramètres"
              to="/settings"
              active={page === "settings"}
            />
          </nav>

          {page === "spaces" && (
            <div className="ml-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    Espaces
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-48 p-2">
                  <div className="space-y-1">
                    {spaces.map((space) => (
                      <SpaceItem
                        key={space.id}
                        spaceId={space.id}
                        label={space.name}
                        onClick={() => setSelectedSpaceId(space.id)}
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
    </header>
  );
};

export default SideNavigation;
