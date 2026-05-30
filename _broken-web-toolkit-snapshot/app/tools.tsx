/**
 * Alpha Creators Toolkit — main router screen
 */
import React, { useState } from 'react';
import { ToolkitNavigator, ToolkitMenuId } from '@/components/toolkit/ToolkitNavigator';
import { PresetsManager } from '@/components/toolkit/PresetsManager';
import { SonyShootingModes } from '@/components/toolkit/SonyShootingModes';
import {
  TrainingModule,
  ChecklistsModule,
  ShortcutsModule,
  InvoiceModule,
} from '@/components/toolkit/ToolkitModules';

export type ViewState =
  | { screen: 'menu' }
  | { screen: 'training' }
  | { screen: 'checklists' }
  | { screen: 'shortcuts' }
  | { screen: 'invoice' }
  | { screen: 'presets' }
  | { screen: 'shooting-modes' };

export default function ToolsScreen() {
  const [viewState, setViewState] = useState<ViewState>({ screen: 'menu' });

  const handleViewChange = (screen: ToolkitMenuId | 'menu') => {
    switch (screen) {
      case 'menu':
        setViewState({ screen: 'menu' });
        break;
      case 'training':
        setViewState({ screen: 'training' });
        break;
      case 'checklists':
        setViewState({ screen: 'checklists' });
        break;
      case 'shortcuts':
        setViewState({ screen: 'shortcuts' });
        break;
      case 'invoice':
        setViewState({ screen: 'invoice' });
        break;
      case 'presets':
        setViewState({ screen: 'presets' });
        break;
      case 'shooting-modes':
        setViewState({ screen: 'shooting-modes' });
        break;
      default:
        setViewState({ screen: 'menu' });
    }
  };

  const goMenu = () => setViewState({ screen: 'menu' });

  return (
    <>
      {viewState.screen === 'menu' && (
        <ToolkitNavigator onSelect={(id) => handleViewChange(id)} />
      )}
      {viewState.screen === 'training' && <TrainingModule onBack={goMenu} />}
      {viewState.screen === 'checklists' && <ChecklistsModule onBack={goMenu} />}
      {viewState.screen === 'shortcuts' && <ShortcutsModule onBack={goMenu} />}
      {viewState.screen === 'invoice' && <InvoiceModule onBack={goMenu} />}
      {viewState.screen === 'presets' && <PresetsManager onBack={goMenu} />}
      {viewState.screen === 'shooting-modes' && <SonyShootingModes onBack={goMenu} />}
    </>
  );
}
