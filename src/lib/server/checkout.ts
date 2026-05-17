import { env } from '$env/dynamic/private';

function readEnv(name: string): string {
	const value = env[name];
	return value ? String(value).trim() : '';
}

/** Site origin for Stripe redirect URLs — Netlify sets URL when PUBLIC_BASE_URL is omitted. */
export function getPublicBaseUrl(): string {
	for (const key of ['PUBLIC_BASE_URL', 'URL', 'DEPLOY_PRIME_URL', 'DEPLOY_URL']) {
		const value = readEnv(key);
		if (value) return value.replace(/\/$/, '');
	}
	return '';
}

export function isCheckoutConfigured(): boolean {
	return Boolean(readEnv('STRIPE_SECRET_KEY') && getPublicBaseUrl());
}
