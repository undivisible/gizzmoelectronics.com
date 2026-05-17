import type { PageServerLoad } from './$types';
import { isCheckoutConfigured } from '$lib/server/checkout';

export const prerender = true;

export const load: PageServerLoad = async () => {
	return { checkoutAvailable: isCheckoutConfigured() };
};
