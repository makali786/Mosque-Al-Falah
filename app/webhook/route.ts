/**
 * Stripe Webhook Handler (Root level for Stripe CLI compatibility)
 *
 * POST /webhook
 *
 * This route handles Stripe webhook events.
 * The Stripe CLI forwards to localhost:3000/webhook by default.
 */

// Re-export the webhook handler from the donations module
export { POST } from '../api/donations/webhook/route';
