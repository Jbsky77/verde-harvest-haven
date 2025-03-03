import React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNavigation,
  SidebarItem,
  SidebarActions,
  SidebarButton,
  useSidebar,
} from 'react-pro-sidebar';
import { Menu, Home, Plant, Sprout, LayoutDashboard } from 'lucide-react';
import { Logo } from './Logo';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut } from 'lucide-react';

export default function SideNavigation() {
  const { collapseSidebar, collapsed } = useSidebar();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { profile, signOut } = useAuth();

  return (
    <Sidebar collapsed={isMobile ? true : collapsed}>
      <SidebarHeader>
        <Logo collapsed={collapsed} />
        {!isMobile && (
          <div
            className={`p-3 transition-all duration-300 ease-linear ${
              collapsed ? 'rotate-180' : ''
            }`}
          >
            <Menu onClick={() => collapseSidebar()} />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation>
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" href="/" />
          <SidebarItem icon={<Home />} label="Espaces" href="/spaces" />
          <SidebarItem icon={<Plant />} label="Plantes" href="/plants" />
          <SidebarItem icon={<Sprout />} label="Variétés" href="/varieties" />
        </SidebarNavigation>
      </SidebarContent>
      <SidebarFooter>
        <SidebarActions>
          {/* Profile button */}
          <Link to="/profile">
            <SidebarButton>
              <User className="h-4 w-4" />
              <span>{!collapsed && 'Profil'}</span>
            </SidebarButton>
          </Link>

          {/* Logout button */}
          <SidebarButton onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
            <span>{!collapsed && 'Déconnexion'}</span>
          </SidebarButton>

          {/* Settings button */}
          {/* <SidebarButton>
            <Settings className="h-4 w-4" />
            <span>{!collapsed && 'Settings'}</span>
          </SidebarButton> */}
        </SidebarActions>
      </SidebarFooter>
    </Sidebar>
  );
}
