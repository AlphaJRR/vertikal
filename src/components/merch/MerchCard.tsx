/**
 * Merch Card Component
 * Displays individual merch items with Coming Soon overlay
 */

import React, { useState } from 'react';
import { MerchItem } from '../../data/merchData';
import EmailSignupModal from './EmailSignupModal';
import './MerchCard.css';

interface MerchCardProps {
  item: MerchItem;
}

const MerchCard: React.FC<MerchCardProps> = ({ item }) => {
  const [showSignup, setShowSignup] = useState(false);

  const handleCardClick = () => {
    setShowSignup(true);
  };

  const getColorLabel = (color: string): string => {
    switch (color) {
      case 'washed-black':
        return 'Washed Black';
      case 'dark-grey':
        return 'Dark Grey';
      default:
        return 'Black';
    }
  };

  return (
    <>
      <div className="merch-card" onClick={handleCardClick}>
        <div className="merch-card-image-container">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="merch-card-image"
            onError={(e) => {
              // Fallback placeholder if image doesn't exist
              (e.target as HTMLImageElement).style.display = 'none';
              const placeholder = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
          <div className="merch-card-placeholder" style={{ display: 'none' }}>
            <span className="merch-placeholder-icon">
              {item.category === 'hoodie' ? '🧥' : '👕'}
            </span>
          </div>
          
          {/* Coming Soon Overlay */}
          <div className="merch-card-overlay">
            <div className="coming-soon-badge">Coming Soon</div>
            <button className="merch-notify-button">
              Notify Me When Available
            </button>
          </div>
        </div>
        
        <div className="merch-card-content">
          <div className="merch-card-header">
            <h3 className="merch-card-name">{item.name}</h3>
            <span className="merch-card-price">${item.price}</span>
          </div>
          
          <p className="merch-card-oneliner">"{item.oneLiner}"</p>
          
          <div className="merch-card-details">
            <span className="merch-card-color">{getColorLabel(item.color)}</span>
            <span className="merch-card-separator">•</span>
            <span className="merch-card-category">
              {item.category === 'hoodie' ? 'Hoodie' : 'Tee'}
            </span>
          </div>
          
          <p className="merch-card-description">{item.description}</p>
        </div>
      </div>

      {showSignup && (
        <EmailSignupModal
          item={item}
          onClose={() => setShowSignup(false)}
        />
      )}
    </>
  );
};

export default MerchCard;
