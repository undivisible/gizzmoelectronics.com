import { json } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { getPublicBaseUrl, isCheckoutConfigured } from '$lib/server/checkout';
import {
	getCatalogProduct,
	type CheckoutItemRequest,
} from '$lib/server/products';

export const prerender = false;

export async function POST({ request }) {
	if (!isCheckoutConfigured()) {
		return json({ error: 'Checkout is not configured' }, { status: 503 });
	}

	const publicBaseUrl = getPublicBaseUrl();
	if (!publicBaseUrl) {
		return json({ error: 'Site URL is not configured' }, { status: 503 });
	}

	try {
		const body = await request.json();
		const items = body?.items as CheckoutItemRequest[] | undefined;
		const customerEmail =
			typeof body?.customerEmail === 'string' ? body.customerEmail : '';

		if (!items || !Array.isArray(items) || items.length === 0) {
			return json({ error: 'No items provided' }, { status: 400 });
		}

		const lineItems = [];

		for (const item of items) {
			const product = getCatalogProduct(item.id);

			if (!product) {
				return json({ error: `Unknown product: ${item.id}` }, { status: 400 });
			}

			const quantity = Math.max(1, Math.min(99, Number(item.quantity) || 1));

			lineItems.push({
				price_data: {
					currency: product.currency,
					product_data: {
						name: product.name,
						description: product.description,
						images: product.image ? [`${publicBaseUrl}${product.image}`] : [],
					},
					unit_amount: product.priceCents,
				},
				quantity,
			});
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: lineItems,
			mode: 'payment',
			success_url: `${publicBaseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${publicBaseUrl}/checkout/cancel`,
			customer_email: customerEmail || undefined,
		});

		return json({ url: session.url });
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'An error occurred' },
			{ status: 500 },
		);
	}
}
