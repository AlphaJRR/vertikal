/**
 * Native-style Tab Bar Component
 * Bottom navigation for AVA Media app
 * Updated with new navigation structure
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Video, Package, ShoppingBag, User, Settings, Wrench } from 'lucide-react';
import './TabBar.css';

interface TabItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

const publicTabs: TabItem[] = [
  { path: '/', label: 'Home', icon: <Home className="w-6 h-6" /> },
  { path: '/portfolio', label: 'Portfolio', icon: <Video className="w-6 h-6" /> },
  { path: '/tools', label: 'Toolkit', icon: <Wrench className="w-6 h-6" /> },
  { path: '/alpha-vault', label: 'Vault', icon: <Package className="w-6 h-6" /> },
  { path: '/shop', label: 'Shop', icon: <ShoppingBag className="w-6 h-6" /> },
];

const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isDemoMode } = useAuth();

  const handleTabClick = (path: string, requiresAuth?: boolean) => {
    if (requiresAuth && !user) {
      navigate('/login');
      return;
    }
    navigate(path);
  };

  // Show portal tab in demo mode OR when authed
  const showPortalTabs = Boolean(user) || isDemoMode;

  // Show different tabs based on auth status
  const tabs = showPortalTabs
    ? [
        { path: '/client-portal', label: 'Portal', icon: <Home className="w-6 h-6" /> },
        { path: '/tools', label: 'Toolkit', icon: <Wrench className="w-6 h-6" /> },
        { path: '/booking', label: 'Book', icon: <Package className="w-6 h-6" />, requiresAuth: true },
        { path: '/shop', label: 'Shop', icon: <ShoppingBag className="w-6 h-6" /> },
        { path: '/profile', label: 'Profile', icon: <User className="w-6 h-6" />, requiresAuth: true },
      ]
    : publicTabs;

  return (
    <nav className="tab-bar safe-area-bottom">
      {tabs.map((tab) => {
        const isActive =
          location.pathname === tab.path ||
          (tab.path === '/client-portal' && location.pathname.startsWith('/projects')) ||
          (tab.path === '/client-portal' && location.pathname.startsWith('/review'));

        return (
          <button
            key={tab.path}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.path, tab.requiresAuth)}
            aria-label={tab.label}
          >
            {tab.icon}
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
      <button
        className={`tab-item ${location.pathname === '/about' ? 'active' : ''}`}
        onClick={() => navigate('/about')}
        aria-label="About & Legal"
      >
        <Settings className="w-6 h-6" />
        <span className="tab-label">About</span>
      </button>
    </nav>
  );
};

export default TabBar;
