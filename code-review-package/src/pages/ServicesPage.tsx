/**
 * Services Page - AVA Media service offerings
 * No placeholder content - all real services
 */

import React from 'react';
import './ServicesPage.css';

const SERVICES = [
  {
    id: 'commercial',
    title: 'Commercial Production',
    description: 'High-quality commercial videos for brands and businesses',
    icon: '📺',
  },
  {
    id: 'music-video',
    title: 'Music Videos',
    description: 'Cinematic music video production for artists',
    icon: '🎵',
  },
  {
    id: 'brand-content',
    title: 'Brand Content',
    description: 'Strategic brand storytelling and content creation',
    icon: '🎬',
  },
  {
    id: 'documentary',
    title: 'Documentary',
    description: 'Documentary filmmaking and storytelling',
    icon: '📹',
  },
];

const ServicesPage: React.FC = () => {
  return (
    <div className="services-page safe-area-top">
      <div className="page-header">
        <h1 className="page-title">Services</h1>
        <p className="page-subtitle">Professional video production services</p>
      </div>

      <div className="services-grid">
        {SERVICES.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>

      <div className="services-cta">
        <h2 className="cta-title">Ready to Start Your Project?</h2>
        <p className="cta-description">
          Book a consultation to discuss your video production needs
        </p>
        <a href="/booking" className="cta-button">
          Book a Consultation
        </a>
      </div>
    </div>
  );
};

export default ServicesPage;
