/**
 * Netlify Function: Create Stripe Checkout Session
 * Handles payment processing for bookings
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const {
      bookingId,
      packageId,
      packageName,
      amount,
      bookingDate,
      location,
      clientEmail,
    } = JSON.parse(event.body);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packageName} - Deposit`,
              description: `Booking deposit for ${bookingDate} at ${location}`,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VITE_APP_URL || 'https://alphavisualartists.com'}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL || 'https://alphavisualartists.com'}/booking?cancelled=true`,
      customer_email: clientEmail,
      metadata: {
        bookingId,
        packageId,
        bookingDate,
        location,
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: session.url,
        sessionId: session.id,
      }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Failed to create checkout session',
      }),
    };
  }
};
