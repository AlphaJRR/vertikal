/**
 * AVA Media - Main App Component
 * React + Vite web app wrapped in Capacitor for iOS
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import TabBar from './components/layout/TabBar';
import HomePage from './pages/HomePage';
import PodcastsPage from './pages/PodcastsPage';
import AlphaVaultPage from './pages/AlphaVaultPage';
import ShopPage from './pages/ShopPage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import AboutLegalPage from './pages/AboutLegalPage';
import FavoritesPage from './pages/FavoritesPage';
import './App.css';

const App: React.FC = () => {
  return (
    <FavoritesProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/podcasts" element={<PodcastsPage />} />
          <Route path="/alpha-vault" element={<AlphaVaultPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/about" element={<AboutLegalPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <TabBar />
      </div>
    </FavoritesProvider>
  );
};

export default App;
