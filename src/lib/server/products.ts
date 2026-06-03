export type CatalogProductId = 'b1' | 'v4' | 'loom' | 'solenoid';

export type CatalogProduct = {
	id: CatalogProductId;
	name: string;
	description: string;
	priceCents: number;
	currency: 'aud' | 'usd';
	image: string;
};

const CATALOG: Record<CatalogProductId, CatalogProduct> = {
	b1: {
		id: 'b1',
		name: 'B1 Boost Controller',
		description:
			'Pre-order deposit — 50% deposit for Gizzmo B1 boost controller',
		priceCents: 29500,
		currency: 'aud',
		image: '/images/b1/b1.png',
	},
	v4: {
		id: 'v4',
		name: 'V4+',
		description: "It's a boost controller. It controls boost.",
		priceCents: 34000,
		currency: 'usd',
		image: '/images/v4.png',
	},
	loom: {
		id: 'loom',
		name: 'v4 wiring loom',
		description: '',
		priceCents: 3000,
		currency: 'usd',
		image: '/images/loom.png',
	},
	solenoid: {
		id: 'solenoid',
		name: 'plugged MAC solenoid with tails',
		description: '',
		priceCents: 8000,
		currency: 'usd',
		image: '/images/solenoid.png',
	},
};

const LEGACY_IDS: Record<string, CatalogProductId> = {
	'1': 'v4',
	'2': 'loom',
	'3': 'solenoid',
};

export function normalizeProductId(
	id: string | number,
): CatalogProductId | null {
	const key = String(id);
	if (key in CATALOG) return key as CatalogProductId;
	if (key in LEGACY_IDS) return LEGACY_IDS[key];
	return null;
}

export function getCatalogProduct(id: string | number): CatalogProduct | null {
	const productId = normalizeProductId(id);
	if (!productId) return null;
	return CATALOG[productId];
}

export type CheckoutItemRequest = {
	id: string | number;
	quantity?: number;
};
