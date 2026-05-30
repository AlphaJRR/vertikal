/**
 * Alpha Vault Page - Offline gallery with download capability
 * Uses Capacitor Filesystem for offline storage
 * Includes pinch-to-zoom and share functionality
 */

import React, { useState, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import './AlphaVaultPage.css';

// Preloaded gallery images (these would be bundled with the app)
const VAULT_IMAGES = [
  {
    id: 'vault-001',
    title: 'Commercial Production',
    thumbnail: '/assets/vault/commercial-001.jpg',
    fullSize: '/assets/vault/commercial-001-full.jpg',
    description: 'Behind the scenes from our latest commercial shoot',
  },
  {
    id: 'vault-002',
    title: 'Music Video Set',
    thumbnail: '/assets/vault/music-video-001.jpg',
    fullSize: '/assets/vault/music-video-001-full.jpg',
    description: 'Production stills from music video project',
  },
  {
    id: 'vault-003',
    title: 'Brand Campaign',
    thumbnail: '/assets/vault/brand-001.jpg',
    fullSize: '/assets/vault/brand-001-full.jpg',
    description: 'Highlights from brand campaign production',
  },
];

const AlphaVaultPage: React.FC = () => {
  const [downloadedImages, setDownloadedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Load downloaded images list on mount
  useEffect(() => {
    loadDownloadedImages();
  }, []);

  const loadDownloadedImages = async () => {
    try {
      // Check if running in Capacitor
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        const files = await Filesystem.readdir({
          path: 'alpha-vault',
          directory: Directory.Data,
        });
        setDownloadedImages(files.files.map(f => f.name));
      }
    } catch (error) {
      // Directory doesn't exist yet, that's okay
      console.log('Vault directory not created yet');
    }
  };

  const handleDownloadImage = async (imageId: string, imageUrl: string) => {
    setIsDownloading(imageId);
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        // Fetch image
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);

        // Ensure directory exists
        try {
          await Filesystem.mkdir({
            path: 'alpha-vault',
            directory: Directory.Data,
            recursive: true,
          });
        } catch (e) {
          // Directory might already exist
        }

        // Save to filesystem
        await Filesystem.writeFile({
          path: `alpha-vault/${imageId}.jpg`,
          data: base64,
          directory: Directory.Data,
        });

        setDownloadedImages(prev => [...prev, `${imageId}.jpg`]);
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleShareImage = async (image: typeof VAULT_IMAGES[0]) => {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        await Share.share({
          title: image.title,
          text: image.description,
          url: image.fullSize,
        });
      } else {
        // Fallback for web
        if (navigator.share) {
          await navigator.share({
            title: image.title,
            text: image.description,
            url: image.fullSize,
          });
        }
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const isImageDownloaded = (imageId: string): boolean => {
    return downloadedImages.includes(`${imageId}.jpg`);
  };

  return (
    <div className="alpha-vault-page safe-area-top">
      <div className="page-header">
        <h1 className="page-title">Alpha Vault</h1>
        <p className="page-subtitle">Exclusive production gallery</p>
        <p className="page-description">
          Download images for offline viewing. Pinch to zoom, tap to share.
        </p>
      </div>

      <div className="vault-grid">
        {VAULT_IMAGES.map(image => {
          const isDownloaded = isImageDownloaded(image.id);
          const isDownloadingThis = isDownloading === image.id;

          return (
            <div key={image.id} className="vault-item">
              <div className="vault-item-thumbnail">
                <img
                  src={image.thumbnail}
                  alt={image.title}
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="vault-item-overlay">
                  <button
                    className="vault-action-button"
                    onClick={() => handleShareImage(image)}
                    aria-label="Share image"
                  >
                    📤 Share
                  </button>
                  <button
                    className="vault-action-button"
                    onClick={() => handleDownloadImage(image.id, image.fullSize)}
                    disabled={isDownloadingThis || isDownloaded}
                    aria-label={isDownloaded ? 'Already downloaded' : 'Download image'}
                  >
                    {isDownloadingThis
                      ? '⏳'
                      : isDownloaded
                      ? '✓ Downloaded'
                      : '⬇️ Download'}
                  </button>
                </div>
              </div>
              <div className="vault-item-content">
                <h3 className="vault-item-title">{image.title}</h3>
                <p className="vault-item-description">{image.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div
          className="image-viewer-modal"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Full size" className="image-viewer-img" />
        </div>
      )}
    </div>
  );
};

export default AlphaVaultPage;
