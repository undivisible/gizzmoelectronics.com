import Stripe from 'stripe';
import { env as dynamicEnv } from '$env/dynamic/private';
import { verifyServerContext } from './index.js';

// Lazily initialize the Stripe client to avoid throwing at module import time
// (which can break the build analysis). The real error will be thrown when
// the code actually attempts to use the client at runtime in a server context.

let _stripe: Stripe | undefined;

function getStripeInstance() {
  if (_stripe) return _stripe;

  // Verify we're in a server context before accessing secrets
  verifyServerContext('Stripe');

  const key = dynamicEnv.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }

  _stripe = new Stripe(key, {
    apiVersion: '2025-04-30.basil', // Use the latest API version
  });

  return _stripe;
}

// Export a proxy that forwards property access to the real Stripe instance.
// This keeps the existing import style `import { stripe } from '$lib/server/stripe'`
// working while deferring initialization until first use.
export const stripe = new Proxy(
  {},
  {
    get(_target, prop: string | symbol) {
      const inst = getStripeInstance();
      // @ts-ignore - forward access to the Stripe instance
      return inst[prop as keyof Stripe];
    },
    apply(_target, _thisArg, args) {
      const inst = getStripeInstance();
      // @ts-ignore
      return (inst as any).apply(_thisArg, args);
    },
  }
) as unknown as Stripe;