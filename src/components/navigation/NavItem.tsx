
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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

export default NavItem;
