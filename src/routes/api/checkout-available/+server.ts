import { json } from '@sveltejs/kit';
import { isCheckoutConfigured } from '$lib/server/checkout';

export const prerender = false;

export function GET() {
	return json({ available: isCheckoutConfigured() });
}
