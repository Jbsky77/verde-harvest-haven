
import NavItem from "./NavItem";
import { useNavigation } from "./useNavigation";

const NavBar = () => {
  const { navigationItems } = useNavigation();
  
  return (
    <nav className="flex space-x-1 overflow-x-auto hide-scrollbar">
      {navigationItems.map((item) => (
        <NavItem
          key={item.to}
          icon={item.icon}
          label={item.label}
          to={item.to}
          active={item.active}
        />
      ))}
    </nav>
  );
};

export default NavBar;
