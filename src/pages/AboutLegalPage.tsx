/**
 * About & Legal Page
 * Contains Privacy Policy and Terms of Service links
 * Contact information and support email
 */

import React from 'react';
import { Browser } from '@capacitor/browser';
import './AboutLegalPage.css';

const PRIVACY_POLICY_URL = 'https://alphavisualartists.com/privacy';
const TERMS_OF_SERVICE_URL = 'https://alphavisualartists.com/terms';
const SUPPORT_EMAIL = 'support@alphavisualartists.com';

const AboutLegalPage: React.FC = () => {
  const handleOpenLink = async (url: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        await Browser.open({
          url: url,
          windowName: '_blank',
        });
      } else {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error opening link:', error);
      window.open(url, '_blank');
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}`;
  };

  return (
    <div className="about-legal-page safe-area-top">
      <div className="page-header">
        <h1 className="page-title">About & Legal</h1>
        <p className="page-subtitle">Information and policies</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2 className="section-title">About AVA Media</h2>
          <p className="section-text">
            AVA Media is a video production company specializing in commercial
            production, music videos, brand content, and documentary filmmaking.
            We create cinematic content that tells compelling stories.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="section-title">Legal</h2>
          
          <div className="legal-link-card">
            <div className="legal-link-content">
              <h3 className="legal-link-title">Privacy Policy</h3>
              <p className="legal-link-description">
                Learn how we collect, use, and protect your personal information.
              </p>
            </div>
            <button
              className="legal-link-button"
              onClick={() => handleOpenLink(PRIVACY_POLICY_URL)}
            >
              View Privacy Policy →
            </button>
          </div>

          <div className="legal-link-card">
            <div className="legal-link-content">
              <h3 className="legal-link-title">Terms of Service</h3>
              <p className="legal-link-description">
                Read our terms and conditions for using the AVA Media app.
              </p>
            </div>
            <button
              className="legal-link-button"
              onClick={() => handleOpenLink(TERMS_OF_SERVICE_URL)}
            >
              View Terms of Service →
            </button>
          </div>
        </section>

        <section className="contact-section">
          <h2 className="section-title">Contact & Support</h2>
          <div className="contact-card">
            <p className="contact-label">Support Email</p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="contact-link"
              onClick={handleEmailClick}
            >
              {SUPPORT_EMAIL}
            </a>
            <p className="contact-note">
              For app support, questions, or feedback, please contact us at the
              email address above.
            </p>
          </div>
        </section>

        <section className="app-info-section">
          <h2 className="section-title">App Information</h2>
          <div className="app-info">
            <p className="app-info-item">
              <strong>Version:</strong> 1.0.0
            </p>
            <p className="app-info-item">
              <strong>Platform:</strong> iOS
            </p>
            <p className="app-info-item">
              <strong>Developer:</strong> Alpha Visual Artists
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutLegalPage;
