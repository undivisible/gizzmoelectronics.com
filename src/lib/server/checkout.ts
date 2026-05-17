function env(name: string): string {
	return (process.env[name] || '').trim();
}

/** Site origin for Stripe redirect URLs — Netlify sets URL when PUBLIC_BASE_URL is omitted. */
export function getPublicBaseUrl(): string {
	for (const key of ['PUBLIC_BASE_URL', 'URL', 'DEPLOY_PRIME_URL', 'DEPLOY_URL']) {
		const value = env(key);
		if (value) return value.replace(/\/$/, '');
	}
	return '';
}

export function isCheckoutConfigured(): boolean {
	return Boolean(env('STRIPE_SECRET_KEY') && getPublicBaseUrl());
}
