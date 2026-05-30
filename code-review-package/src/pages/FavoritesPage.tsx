/**
 * Favorites Page - Shows all favorited podcasts and videos
 */

import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { getAllPodcasts, getAllVideos, getPodcastById, getVideoById } from '../data/podcastData';
import PodcastCard from '../components/podcast/PodcastCard';
import VideoCard from '../components/video/VideoCard';
import './FavoritesPage.css';

const FavoritesPage: React.FC = () => {
  const { favoritePodcasts, favoriteVideos } = useFavorites();
  
  const favoritePodcastEpisodes = favoritePodcasts
    .map(id => getPodcastById(id))
    .filter((episode): episode is NonNullable<typeof episode> => episode !== undefined);
  
  const favoriteVideoContent = favoriteVideos
    .map(id => getVideoById(id))
    .filter((video): video is NonNullable<typeof video> => video !== undefined);

  const hasFavorites = favoritePodcastEpisodes.length > 0 || favoriteVideoContent.length > 0;

  const handlePodcastPlay = (episode: any) => {
    console.log('Play podcast:', episode);
  };

  const handleVideoPlay = (video: any) => {
    console.log('Play video:', video);
  };

  return (
    <div className="favorites-page safe-area-top">
      <div className="page-header">
        <h1 className="page-title">Favorites</h1>
        <p className="page-subtitle">Your saved content</p>
      </div>

      {!hasFavorites ? (
        <div className="empty-favorites">
          <div className="empty-icon">❤️</div>
          <h2 className="empty-title">No favorites yet</h2>
          <p className="empty-description">
            Start favoriting podcasts and videos by tapping the heart icon on any content card.
          </p>
        </div>
      ) : (
        <div className="favorites-content">
          {favoritePodcastEpisodes.length > 0 && (
            <section className="favorites-section">
              <h2 className="section-title">Favorite Podcasts</h2>
              <div className="favorites-grid">
                {favoritePodcastEpisodes.map(episode => (
                  <PodcastCard
                    key={episode.id}
                    episode={episode}
                    onPlay={handlePodcastPlay}
                  />
                ))}
              </div>
            </section>
          )}

          {favoriteVideoContent.length > 0 && (
            <section className="favorites-section">
              <h2 className="section-title">Favorite Videos</h2>
              <div className="favorites-grid">
                {favoriteVideoContent.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={handleVideoPlay}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
