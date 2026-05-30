/**
 * Portfolio Page
 * Public showcase of completed work
 */

import { useEffect, useState } from 'react';
import { Play, Calendar } from 'lucide-react';
import { supabase } from '../config/supabase';
import './PortfolioPage.css';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client_name: string | null;
  thumbnail_url: string;
  video_url: string;
  year: number | null;
  is_featured: boolean;
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('year', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching portfolio:', error);
        // Don't show error if table doesn't exist yet
        if (error.code !== 'PGRST116') {
          console.error('Failed to load portfolio');
        }
      } else {
        setItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(items.map((item) => item.category)))];

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const featuredItems = filteredItems.filter((item) => item.is_featured);
  const otherItems = filteredItems.filter((item) => !item.is_featured);

  const handlePlay = (item: PortfolioItem) => {
    setSelectedItem(item);
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="portfolio-page safe-area-top">
      <header className="portfolio-header">
        <h1 className="portfolio-title">Portfolio</h1>
        <p className="portfolio-subtitle">Our latest work</p>
      </header>

      {categories.length > 1 && (
        <div className="portfolio-filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}

      <main className="portfolio-main">
        {filteredItems.length === 0 ? (
          <div className="empty-portfolio">
            <p>No portfolio items yet</p>
          </div>
        ) : (
          <>
            {featuredItems.length > 0 && (
              <section className="portfolio-section">
                <h2 className="section-title">Featured</h2>
                <div className="portfolio-grid featured">
                  {featuredItems.map((item) => (
                    <div key={item.id} className="portfolio-item" onClick={() => handlePlay(item)}>
                      <div className="portfolio-thumbnail">
                        <img src={item.thumbnail_url} alt={item.title} loading="lazy" />
                        <div className="play-overlay">
                          <Play className="w-12 h-12" />
                        </div>
                      </div>
                      <div className="portfolio-info">
                        <h3 className="portfolio-item-title">{item.title}</h3>
                        {item.client_name && (
                          <p className="portfolio-client">for {item.client_name}</p>
                        )}
                        {item.year && (
                          <p className="portfolio-year">
                            <Calendar className="w-4 h-4" />
                            {item.year}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {otherItems.length > 0 && (
              <section className="portfolio-section">
                {featuredItems.length > 0 && <h2 className="section-title">All Work</h2>}
                <div className="portfolio-grid">
                  {otherItems.map((item) => (
                    <div key={item.id} className="portfolio-item" onClick={() => handlePlay(item)}>
                      <div className="portfolio-thumbnail">
                        <img src={item.thumbnail_url} alt={item.title} loading="lazy" />
                        <div className="play-overlay">
                          <Play className="w-12 h-12" />
                        </div>
                      </div>
                      <div className="portfolio-info">
                        <h3 className="portfolio-item-title">{item.title}</h3>
                        {item.client_name && (
                          <p className="portfolio-client">for {item.client_name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {selectedItem && (
        <div className="video-modal" onClick={() => setSelectedItem(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="video-wrapper">
              <video
                src={selectedItem.video_url}
                controls
                autoPlay
                className="portfolio-video"
              />
            </div>
            <div className="video-info">
              <h3 className="video-title">{selectedItem.title}</h3>
              {selectedItem.client_name && (
                <p className="video-client">for {selectedItem.client_name}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
