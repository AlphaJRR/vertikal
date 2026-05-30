/**
 * Booking Page - External booking with payment disclaimer
 * Opens Calendly link in Capacitor Browser
 * Clear disclaimer that payments occur outside the app
 */

import React, { useState } from 'react';
import { Browser } from '@capacitor/browser';
import './BookingPage.css';

const CALENDLY_URL = 'https://calendly.com/alphavisualartists/consultation';

const BookingPage: React.FC = () => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenBooking = async () => {
    setIsOpening(true);
    try {
      // Check if running in Capacitor
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        await Browser.open({
          url: CALENDLY_URL,
          windowName: '_blank',
        });
      } else {
        // Fallback for web
        window.open(CALENDLY_URL, '_blank');
      }
    } catch (error) {
      console.error('Error opening booking:', error);
      // Fallback to window.open
      window.open(CALENDLY_URL, '_blank');
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="booking-page safe-area-top">
      <div className="page-header">
        <h1 className="page-title">Book a Project</h1>
        <p className="page-subtitle">Schedule a consultation</p>
      </div>

      <div className="booking-content">
        <div className="booking-card">
          <div className="booking-icon">📅</div>
          <h2 className="booking-card-title">Schedule Your Consultation</h2>
          <p className="booking-card-description">
            Book a time to discuss your video production project. We'll review
            your needs and provide a customized proposal.
          </p>

          {/* Important Payment Disclaimer */}
          <div className="payment-disclaimer">
            <h3 className="disclaimer-title">⚠️ Payment Information</h3>
            <p className="disclaimer-text">
              <strong>Payments for video production services occur outside this app.</strong>
              <br />
              <br />
              When you book a consultation, you'll be redirected to our booking
              platform where you can schedule your session. All payments and
              service agreements are handled through our external booking system.
              <br />
              <br />
              This app does not process payments or handle financial transactions.
            </p>
          </div>

          <button
            className="booking-button"
            onClick={handleOpenBooking}
            disabled={isOpening}
          >
            {isOpening ? 'Opening...' : 'Open Booking in Browser'}
          </button>

          <p className="booking-note">
            Clicking the button above will open our booking platform in your
            browser. You can schedule your consultation there.
          </p>
        </div>

        <div className="booking-info">
          <h3 className="info-title">What to Expect</h3>
          <ul className="info-list">
            <li>Initial consultation call (30 minutes)</li>
            <li>Project requirements discussion</li>
            <li>Customized proposal and timeline</li>
            <li>Transparent pricing and deliverables</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
