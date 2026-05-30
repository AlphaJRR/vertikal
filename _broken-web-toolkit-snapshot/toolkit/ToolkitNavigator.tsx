import React from 'react';
import {
  GraduationCap,
  ListChecks,
  Zap,
  FileText,
  Save,
  Camera,
  ChevronRight,
} from 'lucide-react';
import './toolkit.css';

export type ToolkitMenuId =
  | 'training'
  | 'checklists'
  | 'shortcuts'
  | 'invoice'
  | 'presets'
  | 'shooting-modes';

export interface ToolkitMenuItem {
  id: ToolkitMenuId;
  title: string;
  description: string;
  icon: 'training' | 'checklists' | 'shortcuts' | 'invoice' | 'save' | 'camera';
  color: string;
}

export const menuItems: ToolkitMenuItem[] = [
  {
    id: 'training',
    title: 'Creator Training',
    description: 'Workflows, client communication, and on-set fundamentals',
    icon: 'training',
    color: '#3a86ff',
  },
  {
    id: 'checklists',
    title: 'Production Checklists',
    description: 'Pre-shoot, on-set, and delivery checklists',
    icon: 'checklists',
    color: '#06d6a0',
  },
  {
    id: 'shortcuts',
    title: 'Camera Shortcuts',
    description: 'Quick reference for Sony custom buttons and menus',
    icon: 'shortcuts',
    color: '#ffbe0b',
  },
  {
    id: 'invoice',
    title: 'Invoice Builder',
    description: 'Line items, rates, and export-ready summaries',
    icon: 'invoice',
    color: '#fb5607',
  },
  {
    id: 'presets',
    title: 'Equipment Presets',
    description: 'Save camera + audio configurations',
    icon: 'save',
    color: '#8338ec',
  },
  {
    id: 'shooting-modes',
    title: 'Sony Shooting Modes',
    description: 'Master manual, aperture, shutter modes',
    icon: 'camera',
    color: '#ff006e',
  },
];

const iconMap = {
  training: GraduationCap,
  checklists: ListChecks,
  shortcuts: Zap,
  invoice: FileText,
  save: Save,
  camera: Camera,
};

interface ToolkitNavigatorProps {
  onSelect: (id: ToolkitMenuId) => void;
}

export const ToolkitNavigator: React.FC<ToolkitNavigatorProps> = ({ onSelect }) => {
  return (
    <div className="toolkit-screen">
      <header className="toolkit-header">
        <div>
          <h1 className="toolkit-title">Alpha Creators Toolkit</h1>
          <p className="toolkit-subtitle">On-set tools for AVA creators</p>
        </div>
      </header>

      <div className="toolkit-menu-grid">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <button
              key={item.id}
              type="button"
              className="toolkit-menu-card"
              onClick={() => onSelect(item.id)}
            >
              <div className="toolkit-menu-icon" style={{ background: `${item.color}22` }}>
                <Icon size={22} color={item.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <ChevronRight size={20} color="#737373" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToolkitNavigator;
