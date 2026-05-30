/**
 * Email Signup Modal Component
 * Collects email for merch notifications with privacy notice
 */

import React, { useState } from 'react';
import { MerchItem } from '../../data/merchData';
import './EmailSignupModal.css';

interface EmailSignupModalProps {
  item: MerchItem;
  onClose: () => void;
}

const EmailSignupModal: React.FC<EmailSignupModalProps> = ({ item, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // In production, this would send to your backend/email service
      // For now, we'll store in localStorage and log
      const notifications = JSON.parse(
        localStorage.getItem('ava_merch_notifications') || '[]'
      );
      
      notifications.push({
        email,
        itemId: item.id,
        itemName: item.name,
        timestamp: new Date().toISOString(),
      });

      localStorage.setItem('ava_merch_notifications', JSON.stringify(notifications));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Error saving notification:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="email-signup-modal-overlay" onClick={onClose}>
        <div className="email-signup-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h2 className="modal-title">You're on the list!</h2>
            <p className="modal-message">
              We'll notify you when <strong>{item.name}</strong> is available.
            </p>
            <button className="modal-button" onClick={onClose}>
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="email-signup-modal-overlay" onClick={onClose}>
      <div className="email-signup-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>
        
        <div className="modal-header">
          <h2 className="modal-title">Notify Me</h2>
          <p className="modal-subtitle">
            Get notified when <strong>{item.name}</strong> is available
          </p>
        </div>

        <form onSubmit={handleSubmit} className="email-signup-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="form-input"
              required
              disabled={isSubmitting}
              autoFocus
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="privacy-notice">
            <p className="privacy-text">
              <strong>Privacy Notice:</strong> By submitting your email, you agree to receive
              notifications about product availability. We respect your privacy and will only
              use your email for this purpose. You can unsubscribe at any time.
            </p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="modal-button secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-button primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Notify Me'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailSignupModal;
