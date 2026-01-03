import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin key
);

export async function handler(event: any) {
  const sig = event.headers['stripe-signature'];
  
  let stripeEvent: Stripe.Event;
  
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  // Handle the event
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    
    const userId = session.metadata?.userId;
    const coinAmount = parseInt(session.metadata?.coinAmount || '0');
    
    if (!userId || !coinAmount) {
      return { statusCode: 400, body: 'Missing metadata' };
    }
    
    try {
      // Add coins to user's balance
      const { error: addCoinsError } = await supabase.rpc('add_coins', {
        p_user_id: userId,
        p_amount: coinAmount
      });
      
      if (addCoinsError) throw addCoinsError;
      
      // Record purchase
      const { error: recordError } = await supabase
        .from('coin_purchases')
        .insert({
          user_id: userId,
          amount: coinAmount,
          price_usd: (session.amount_total || 0) / 100,
          stripe_session_id: session.id,
          status: 'completed'
        });
      
      if (recordError) throw recordError;
      
      console.log(`✅ Added ${coinAmount} coins to user ${userId}`);
      
    } catch (error: any) {
      console.error('Error processing payment:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
}

