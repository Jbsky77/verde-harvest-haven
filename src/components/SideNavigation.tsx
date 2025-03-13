
import { 
  Home, 
  BarChart3, 
  Droplet, 
  Sprout, 
  Settings,
  ListChecks,
  MessageCircleQuestion
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
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

const SideNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const getActivePage = () => {
    if (currentPath === "/") return "home";
    if (currentPath === "/analytics" || currentPath.startsWith("/analytics")) return "analytics";
    if (currentPath === "/fertilizers" || currentPath.startsWith("/fertilizers")) return "fertilizers";
    if (currentPath === "/plants" || currentPath.startsWith("/plants")) return "plants";
    if (currentPath === "/settings" || currentPath.startsWith("/settings")) return "settings";
    if (currentPath === "/tasks" || currentPath.startsWith("/tasks")) return "tasks";
    if (currentPath === "/help" || currentPath.startsWith("/help")) return "help";
    return "home"; // default
  };

  const page = getActivePage();

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
              icon={<ListChecks className="h-4 w-4" />}
              label={t('common.tasks')}
              to="/tasks"
              active={page === "tasks"}
            />
            <NavItem
              icon={<MessageCircleQuestion className="h-4 w-4" />}
              label={t('common.help')}
              to="/help"
              active={page === "help"}
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default SideNavigation;
