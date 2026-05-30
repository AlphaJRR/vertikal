/**
 * Native-style Tab Bar Component
 * Bottom navigation for AVA Media app
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TabBar.css';

interface TabItem {
  path: string;
  label: string;
  icon: string;
}

const tabs: TabItem[] = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/podcasts', label: 'Podcasts', icon: '🎙️' },
  { path: '/alpha-vault', label: 'Alpha Vault', icon: '📦' },
  { path: '/shop', label: 'Shop', icon: '🛍️' },
  { path: '/services', label: 'Services', icon: '🎬' },
  { path: '/booking', label: 'Booking', icon: '📅' },
];

const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="tab-bar safe-area-bottom">
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.path)}
            aria-label={tab.label}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
      <button
        className={`tab-item ${location.pathname === '/about' ? 'active' : ''}`}
        onClick={() => navigate('/about')}
        aria-label="About & Legal"
      >
        <span className="tab-icon">⚙️</span>
        <span className="tab-label">About</span>
      </button>
    </nav>
  );
};

export default TabBar;
