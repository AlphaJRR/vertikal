/**
 * Shop Page - Merch Store
 * Displays apparel line with Coming Soon overlay
 * No purchase functionality - email notifications only
 */

import React, { useState } from 'react';
import { getAllMerch, getMerchByCategory, getFeaturedMerch } from '../data/merchData';
import MerchCard from '../components/merch/MerchCard';
import './ShopPage.css';

const ShopPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'tee' | 'hoodie'>('all');
  
  const featuredMerch = getFeaturedMerch();
  const filteredMerch = getMerchByCategory(filter);

  return (
    <div className="shop-page safe-area-top">
      <div className="page-header">
        <h1 className="page-title">Shop</h1>
        <p className="page-subtitle">AVA Media Apparel</p>
        <p className="page-description">
          Premium oversized tees and hoodies. Coming soon.
        </p>
      </div>

      {/* Featured Section */}
      {featuredMerch.length > 0 && (
        <section className="shop-section">
          <h2 className="section-title">Featured</h2>
          <div className="merch-grid">
            {featuredMerch.map(item => (
              <MerchCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Filter Tabs */}
      <section className="shop-section">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${filter === 'tee' ? 'active' : ''}`}
            onClick={() => setFilter('tee')}
          >
            Tees
          </button>
          <button
            className={`filter-tab ${filter === 'hoodie' ? 'active' : ''}`}
            onClick={() => setFilter('hoodie')}
          >
            Hoodies
          </button>
        </div>

        {/* Merch Grid */}
        <div className="merch-grid">
          {filteredMerch.length > 0 ? (
            filteredMerch.map(item => (
              <MerchCard key={item.id} item={item} />
            ))
          ) : (
            <div className="empty-state">
              <p>No items found</p>
            </div>
          )}
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="coming-soon-notice">
        <div className="notice-content">
          <h3 className="notice-title">Coming Soon</h3>
          <p className="notice-text">
            Our apparel line is launching soon. Sign up for notifications to be
            the first to know when items are available.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
