/**
 * Home Page - Main landing page for AVA Media
 * Features hero section and featured content
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedPodcasts, getFeaturedVideos } from '../data/podcastData';
import VideoCard from '../components/video/VideoCard';
import PodcastCard from '../components/podcast/PodcastCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const featuredPodcasts = getFeaturedPodcasts();
  const featuredVideos = getFeaturedVideos();

  const handleVideoPlay = (video: any) => {
    // In a real app, this would open a video player
    console.log('Play video:', video);
  };

  const handlePodcastPlay = (episode: any) => {
    // In a real app, this would open a podcast player
    console.log('Play podcast:', episode);
  };

  return (
    <div className="home-page safe-area-top">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">AVA Media</h1>
          <p className="hero-subtitle">Video Production Portfolio & Platform</p>
          <p className="hero-description">
            Showcasing cinematic excellence and production expertise
          </p>
        </div>
      </section>

      {/* Featured Videos */}
      {featuredVideos.length > 0 && (
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">Featured Videos</h2>
            <button
              className="section-link"
              onClick={() => navigate('/podcasts')}
            >
              View All →
            </button>
          </div>
          <div className="content-grid">
            {featuredVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={handleVideoPlay}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Podcasts */}
      {featuredPodcasts.length > 0 && (
        <section className="content-section">
          <div className="section-header">
            <h2 className="section-title">Featured Podcasts</h2>
            <button
              className="section-link"
              onClick={() => navigate('/podcasts')}
            >
              View All →
            </button>
          </div>
          <div className="content-grid">
            {featuredPodcasts.map(episode => (
              <PodcastCard
                key={episode.id}
                episode={episode}
                onPlay={handlePodcastPlay}
              />
            ))}
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="content-section">
        <div className="quick-links">
          <button
            className="quick-link-card"
            onClick={() => navigate('/alpha-vault')}
          >
            <span className="quick-link-icon">📦</span>
            <span className="quick-link-text">Alpha Vault</span>
          </button>
          <button
            className="quick-link-card"
            onClick={() => navigate('/services')}
          >
            <span className="quick-link-icon">🎬</span>
            <span className="quick-link-text">Services</span>
          </button>
          <button
            className="quick-link-card"
            onClick={() => navigate('/booking')}
          >
            <span className="quick-link-icon">📅</span>
            <span className="quick-link-text">Book a Project</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
