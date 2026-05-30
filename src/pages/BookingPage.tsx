/**
 * Booking Page - Updated with Stripe Payment Flow
 * Multi-step booking process with payment integration
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, Check, ArrowLeft } from 'lucide-react';
import { packages, Package } from '../data/packages';
import { useAuth } from '../context/AuthContext';
import { stripePromise } from '../config/stripe';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';
import './BookingPage.css';

export default function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const handlePayment = async () => {
    if (!selectedPackage || !user) {
      toast.error('Please select a package and sign in');
      return;
    }

    setLoading(true);

    try {
      // Create booking record first
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          client_id: user.id,
          package_id: selectedPackage.id,
          package_name: selectedPackage.name,
          booking_date: date,
          booking_time: time,
          location: location,
          deposit_amount: selectedPackage.deposit,
          total_amount: selectedPackage.price,
          status: 'pending',
        })
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      // Create Stripe checkout session
      // Note: This requires a backend endpoint. For now, we'll use a placeholder
      // In production, create: /api/create-checkout-session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          amount: selectedPackage.deposit * 100, // Stripe uses cents
          bookingDate: `${date}T${time}`,
          location,
          clientEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url, sessionId } = await response.json();

      // Update booking with session ID
      await supabase
        .from('bookings')
        .update({ stripe_session_id: sessionId })
        .eq('id', booking.id);

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        // Fallback: Use Stripe.js
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId,
          });
          if (error) {
            throw error;
          }
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="booking-page safe-area-top">
      <header className="booking-header">
        <button onClick={handleBack} className="back-button" aria-label="Go back">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="booking-title">Book a Session</h1>
        <div className="step-indicator">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`step-dot ${s <= step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
      </header>

      <main className="booking-main">
        {step === 1 && (
          <div className="booking-step">
            <h2 className="step-title">Select Package</h2>
            <div className="packages-grid">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setStep(2);
                  }}
                  className={`package-card ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}
                >
                  {pkg.popular && (
                    <span className="popular-badge">POPULAR</span>
                  )}
                  <h3 className="package-name">{pkg.name}</h3>
                  <p className="package-description">{pkg.description}</p>
                  <div className="package-features">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="package-feature">
                        <Check className="w-4 h-4" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="package-pricing">
                    <span className="package-price">${pkg.price}</span>
                    <span className="package-deposit">${pkg.deposit} deposit</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="booking-step">
            <h2 className="step-title">Select Date & Time</h2>
            <div className="form-section">
              <label className="form-label">
                <Calendar className="w-5 h-5" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
                required
              />
            </div>
            <div className="form-section">
              <label className="form-label">
                <Clock className="w-5 h-5" />
                Time
              </label>
              <div className="time-grid">
                {times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`time-button ${time === t ? 'selected' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={!date || !time}
              className="continue-button"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="booking-step">
            <h2 className="step-title">Shoot Location</h2>
            <div className="form-section">
              <label className="form-label">
                <MapPin className="w-5 h-5" />
                Address or Venue
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter address or venue name"
                className="form-input"
                required
              />
            </div>
            <button
              onClick={() => setStep(4)}
              disabled={!location}
              className="continue-button"
            >
              Continue
            </button>
          </div>
        )}

        {step === 4 && selectedPackage && (
          <div className="booking-step">
            <h2 className="step-title">Confirm & Pay</h2>
            <div className="booking-summary">
              <div className="summary-item">
                <h3 className="summary-label">Package</h3>
                <p className="summary-value">{selectedPackage.name}</p>
              </div>
              <div className="summary-item">
                <h3 className="summary-label">Date</h3>
                <p className="summary-value">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="summary-item">
                <h3 className="summary-label">Time</h3>
                <p className="summary-value">{time}</p>
              </div>
              <div className="summary-item">
                <h3 className="summary-label">Location</h3>
                <p className="summary-value">{location}</p>
              </div>
              <div className="summary-divider" />
              <div className="summary-item">
                <h3 className="summary-label">Package Total</h3>
                <p className="summary-value">${selectedPackage.price}</p>
              </div>
              <div className="summary-item highlight">
                <h3 className="summary-label">Deposit Due Now</h3>
                <p className="summary-value">${selectedPackage.deposit}</p>
              </div>
            </div>

            {!user && (
              <div className="auth-prompt">
                <p className="auth-text">
                  Please <button onClick={() => navigate('/login')} className="auth-link">sign in</button> or{' '}
                  <button onClick={() => navigate('/signup')} className="auth-link">create an account</button> to continue
                </p>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading || !user}
              className="payment-button"
            >
              <CreditCard className="w-5 h-5" />
              {loading ? 'Processing...' : `Pay $${selectedPackage.deposit} Deposit`}
            </button>

            <p className="payment-disclaimer">
              <strong>Payment Information:</strong> Payments for video production services are processed securely through Stripe.
              The deposit secures your booking date. Remaining balance is due before delivery.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
