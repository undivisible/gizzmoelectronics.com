import { stripe } from '$lib/server/stripe';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    return json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }
  
  try {
    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Handle successful payment
        console.log('Payment successful for session:', session.id);
        // Here you would typically:
        // 1. Update your database
        // 2. Fulfill the order
        // 3. Send confirmation email
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', paymentIntent.id);
        break;
        
      // Add other event types as needed
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'Webhook error' },
      { status: 400 }
    );
  }
}