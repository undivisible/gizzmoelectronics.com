import { json } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { PUBLIC_BASE_URL } from '$env/static/public';

export async function POST({ request }) {
  try {
    const { items, customerEmail } = await request.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return json({ error: 'No items provided' }, { status: 400 });
    }
    
    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
          images: item.image ? [PUBLIC_BASE_URL + item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }));
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${PUBLIC_BASE_URL}/checkout/cancel`,
      customer_email: customerEmail || undefined,
    });
    
    return json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}