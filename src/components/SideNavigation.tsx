
import LanguageSwitcher from "./LanguageSwitcher";
import NavBar from "./navigation/NavBar";

const SideNavigation = () => {
  return (
    <header className="w-full bg-white border-b shadow-sm z-40 sticky top-0">
      <div className="container mx-auto">
        <div className="flex items-center h-16">
          <NavBar />
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default SideNavigation;
