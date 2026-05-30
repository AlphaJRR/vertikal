/**
 * AVA Media - Main App Component
 * React + Vite web app wrapped in Capacitor for iOS
 * Full client portal with authentication and payments
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import TabBar from './components/layout/TabBar';
import { DevOverlay } from './components/dev/DevOverlay';

// Public Pages
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import PodcastsPage from './pages/PodcastsPage';
import AlphaVaultPage from './pages/AlphaVaultPage';
import ShopPage from './pages/ShopPage';
import ServicesPage from './pages/ServicesPage';
import FavoritesPage from './pages/FavoritesPage';
import AboutLegalPage from './pages/AboutLegalPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Protected Pages
import BookingPage from './pages/BookingPage';
import ClientPortalPage from './pages/ClientPortalPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import VideoReviewPage from './pages/VideoReviewPage';
import ProfilePage from './pages/ProfilePage';
import CreatorsToolkitPage from './pages/CreatorsToolkitPage';

import './App.css';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isDemoMode, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!isAuthenticated && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * Public Route Component
 * Redirects to client portal if user is already authenticated
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isDemoMode, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (isAuthenticated && !isDemoMode) {
    return <Navigate to="/client-portal" replace />;
  }

  return <>{children}</>;
}

/**
 * App Routes Component
 * Defines all application routes
 */
function AppRoutes() {
  return (
    <div className="app-routes">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/podcasts" element={<PodcastsPage />} />
        <Route path="/alpha-vault" element={<AlphaVaultPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/about" element={<AboutLegalPage />} />
        <Route path="/tools" element={<CreatorsToolkitPage />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-portal"
          element={
            <ProtectedRoute>
              <ClientPortalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:deliverableId"
          element={
            <ProtectedRoute>
              <VideoReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <TabBar />
      <DevOverlay />
    </div>
  );
}

/**
 * Root App Component
 * Wraps app with providers
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            },
            success: {
              iconTheme: {
                primary: 'var(--accent)',
                secondary: 'var(--text-primary)',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
