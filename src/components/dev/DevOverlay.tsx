import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured, isDemoMode } from '../../config/supabase';

/**
 * Dev-only overlay to prevent “it’s not working” confusion.
 * Shows route + demo/auth state at a glance.
 */
export function DevOverlay() {
  const location = useLocation();
  const { user, isAuthenticated, isDemoMode: ctxDemo, loading } = useAuth();

  if (!import.meta.env.DEV) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 92, // keep above tab bar
        zIndex: 9999,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        fontSize: 12,
        lineHeight: 1.35,
        background: 'rgba(0,0,0,0.75)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 10,
        padding: '10px 12px',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <strong>route</strong>: {location.pathname}
        </div>
        <div>
          <strong>supabaseConfigured</strong>: {String(isSupabaseConfigured)}
        </div>
        <div>
          <strong>demoMode(env)</strong>: {String(isDemoMode)}
        </div>
        <div>
          <strong>demoMode(ctx)</strong>: {String(ctxDemo)}
        </div>
        <div>
          <strong>loading</strong>: {String(loading)}
        </div>
        <div>
          <strong>authenticated</strong>: {String(isAuthenticated)}
        </div>
        <div>
          <strong>user</strong>: {user?.id || 'null'} {user?.email ? `(${user.email})` : ''}
        </div>
        <div>
          <strong>vite</strong>: {window.location.origin}
        </div>
      </div>
    </div>
  );
}

