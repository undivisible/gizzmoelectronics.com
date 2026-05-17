export function isCheckoutConfigured(): boolean {
	const secretKey = process.env.STRIPE_SECRET_KEY;
	const baseUrl = process.env.PUBLIC_BASE_URL;
	return Boolean(secretKey && baseUrl);
}
