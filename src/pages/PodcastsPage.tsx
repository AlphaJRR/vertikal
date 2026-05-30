/**
 * Podcasts Page - All podcast episodes
 * Includes favorites functionality
 */

import React, { useState } from 'react';
import { getAllPodcasts } from '../data/podcastData';
import PodcastCard from '../components/podcast/PodcastCard';
import './PodcastsPage.css';

const PodcastsPage: React.FC = () => {
  const allPodcasts = getAllPodcasts();
  const [filter, setFilter] = useState<'all' | 'featured' | 'favorites'>('all');

  const handlePodcastPlay = (episode: any) => {
    // In a real app, this would open a podcast player
    console.log('Play podcast:', episode);
  };

  const filteredPodcasts = allPodcasts.filter(podcast => {
    if (filter === 'featured') {
      return podcast.featured;
    }
    // For favorites, we'd need to check the favorites context
    // This is a simplified version
    return true;
  });

  return (
    <div className="podcasts-page safe-area-top">
      <div className="page-header">
        <h1 className="page-title">Podcasts</h1>
        <p className="page-subtitle">Industry insights and conversations</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-tab ${filter === 'featured' ? 'active' : ''}`}
          onClick={() => setFilter('featured')}
        >
          Featured
        </button>
        <button
          className={`filter-tab ${filter === 'favorites' ? 'active' : ''}`}
          onClick={() => setFilter('favorites')}
        >
          Favorites
        </button>
      </div>

      {/* Podcasts Grid */}
      <div className="podcasts-grid">
        {filteredPodcasts.length > 0 ? (
          filteredPodcasts.map(episode => (
            <PodcastCard
              key={episode.id}
              episode={episode}
              onPlay={handlePodcastPlay}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>No podcasts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastsPage;
