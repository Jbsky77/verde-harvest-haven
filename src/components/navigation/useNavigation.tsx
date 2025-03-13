
import { useLocation } from "react-router-dom";
import { 
  Home, 
  BarChart3, 
  Droplet, 
  Sprout, 
  Settings,
  ListChecks,
  MessageCircleQuestion
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const useNavigation = () => {
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

  const activePage = getActivePage();

  const navigationItems = [
    {
      icon: <Home className="h-4 w-4" />,
      label: t('common.home'),
      to: "/",
      active: activePage === "home"
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      label: t('common.analytics'),
      to: "/analytics",
      active: activePage === "analytics"
    },
    {
      icon: <Droplet className="h-4 w-4" />,
      label: t('common.fertilizers'),
      to: "/fertilizers",
      active: activePage === "fertilizers"
    },
    {
      icon: <Sprout className="h-4 w-4" />,
      label: t('common.varieties'),
      to: "/plants",
      active: activePage === "plants"
    },
    {
      icon: <ListChecks className="h-4 w-4" />,
      label: t('common.tasks'),
      to: "/tasks",
      active: activePage === "tasks"
    },
    {
      icon: <MessageCircleQuestion className="h-4 w-4" />,
      label: t('common.help'),
      to: "/help",
      active: activePage === "help"
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: t('common.settings'),
      to: "/settings",
      active: activePage === "settings"
    }
  ];

  return { navigationItems, activePage };
};
