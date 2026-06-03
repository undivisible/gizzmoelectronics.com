import { expect, test } from 'bun:test';
import { getCatalogProduct } from '../src/lib/server/products';

test('B1 preorder deposit is priced in AUD', () => {
	expect(getCatalogProduct('b1')?.currency).toBe('aud');
});
