/**
 * Podcast Card Component with Favorites Support
 * Displays podcast episodes with favorite toggle
 */

import React from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { PodcastEpisode } from '../../data/podcastData';
import './PodcastCard.css';

interface PodcastCardProps {
  episode: PodcastEpisode;
  onPlay?: (episode: PodcastEpisode) => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ episode, onPlay }) => {
  const { isPodcastFavorite, togglePodcastFavorite } = useFavorites();
  const isFavorite = isPodcastFavorite(episode.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePodcastFavorite(episode.id);
  };

  const handleCardClick = () => {
    if (onPlay) {
      onPlay(episode);
    }
  };

  return (
    <div className="podcast-card" onClick={handleCardClick}>
      <div className="podcast-card-thumbnail">
        {episode.thumbnail ? (
          <img src={episode.thumbnail} alt={episode.title} loading="lazy" />
        ) : (
          <div className="podcast-card-placeholder">
            <span>🎙️</span>
          </div>
        )}
        {episode.duration && (
          <span className="podcast-card-duration">{episode.duration}</span>
        )}
        <button
          className={`podcast-card-favorite ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="podcast-card-content">
        <h3 className="podcast-card-title">{episode.title}</h3>
        {episode.guestName && (
          <p className="podcast-card-guest">with {episode.guestName}</p>
        )}
        {episode.description && (
          <p className="podcast-card-description">{episode.description}</p>
        )}
        {episode.publishDate && (
          <p className="podcast-card-date">{episode.publishDate}</p>
        )}
      </div>
    </div>
  );
};

export default PodcastCard;
