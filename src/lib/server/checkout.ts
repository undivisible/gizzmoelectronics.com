import { env as dynamicPrivateEnv } from '$env/dynamic/private';
import { env as dynamicPublicEnv } from '$env/dynamic/public';

export function isCheckoutConfigured(): boolean {
	const secretKey = dynamicPrivateEnv.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
	const baseUrl = dynamicPublicEnv.PUBLIC_BASE_URL || process.env.PUBLIC_BASE_URL;
	return Boolean(secretKey && baseUrl);
}
