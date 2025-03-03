import React, { useState } from 'react';
import { 
  Sidebar, 
  Menu as ProSidebarMenu,
  MenuItem,
  useProSidebar
} from 'react-pro-sidebar';
import { Menu, Home, Leaf, Sprout, LayoutDashboard, User, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export default function SideNavigation() {
  const { collapseSidebar, collapsed } = useProSidebar();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { profile, signOut } = useAuth();

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={isMobile ? true : collapsed}>
        <div className="flex justify-between items-center py-2">
          <Logo collapsed={collapsed} />
          {!isMobile && (
            <button
              className={`p-3 transition-all duration-300 ease-linear ${
                collapsed ? 'rotate-180' : ''
              }`}
              onClick={() => collapseSidebar()}
            >
              <Menu size={18} />
            </button>
          )}
        </div>
        
        <div className="flex flex-col justify-between h-full">
          <ProSidebarMenu>
            <MenuItem icon={<LayoutDashboard />} component={<Link to="/" />}>
              Dashboard
            </MenuItem>
            <MenuItem icon={<Home />} component={<Link to="/spaces" />}>
              Espaces
            </MenuItem>
            <MenuItem icon={<Leaf />} component={<Link to="/plants" />}>
              Plantes
            </MenuItem>
            <MenuItem icon={<Sprout />} component={<Link to="/varieties" />}>
              Variétés
            </MenuItem>
          </ProSidebarMenu>
          
          <div className="mb-8">
            <ProSidebarMenu>
              <MenuItem 
                icon={<User className="h-4 w-4" />} 
                component={<Link to="/profile" />}
              >
                {!collapsed && 'Profil'}
              </MenuItem>
              
              <MenuItem 
                icon={<LogOut className="h-4 w-4" />}
                onClick={() => signOut()}
              >
                {!collapsed && 'Déconnexion'}
              </MenuItem>
            </ProSidebarMenu>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
