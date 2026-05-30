/**
 * Video Card Component with Favorites Support
 * Displays video content with favorite toggle
 */

import React from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { VideoContent } from '../../data/podcastData';
import './VideoCard.css';

interface VideoCardProps {
  video: VideoContent;
  onPlay?: (video: VideoContent) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const { isVideoFavorite, toggleVideoFavorite } = useFavorites();
  const isFavorite = isVideoFavorite(video.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVideoFavorite(video.id);
  };

  const handleCardClick = () => {
    if (onPlay) {
      onPlay(video);
    }
  };

  return (
    <div className="video-card" onClick={handleCardClick}>
      <div className="video-card-thumbnail">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} loading="lazy" />
        ) : (
          <div className="video-card-placeholder">
            <span>🎬</span>
          </div>
        )}
        {video.duration && (
          <span className="video-card-duration">{video.duration}</span>
        )}
        <button
          className={`video-card-favorite ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="video-card-content">
        <h3 className="video-card-title">{video.title}</h3>
        {video.creator && (
          <p className="video-card-creator">by {video.creator}</p>
        )}
        {video.description && (
          <p className="video-card-description">{video.description}</p>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
