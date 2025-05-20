import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { verifyServerContext } from './index.js';

// Verify we're in a server context
verifyServerContext('Stripe');

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil', // Use the latest API version
});