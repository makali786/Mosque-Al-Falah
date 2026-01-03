# =============================================================================

# DONATION SYSTEM - ENVIRONMENT VARIABLES

# =============================================================================

# Copy these to your .env file and fill in the values

# Stripe Configuration (Required for donations)

# Get these from: https://dashboard.stripe.com/apikeys

STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Stripe Webhook Secret (Required for processing payments)

# Get this when you create a webhook in: https://dashboard.stripe.com/webhooks

# Point webhook to: https://your-domain.com/api/donations/webhook

STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# =============================================================================

# STRIPE SETUP INSTRUCTIONS

# =============================================================================

#

# 1. Create a Stripe account at https://dashboard.stripe.com/register

#

# 2. Get your API keys:

# - Go to https://dashboard.stripe.com/apikeys

# - Copy the "Publishable key" (starts with pk\_)

# - Copy the "Secret key" (starts with sk\_)

#

# 3. Create a webhook endpoint:

# - Go to https://dashboard.stripe.com/webhooks

# - Click "Add endpoint"

# - Enter your endpoint URL: https://your-domain.com/api/donations/webhook

# - Select events to listen for:

# \* payment_intent.succeeded

# \* payment_intent.payment_failed

# \* invoice.paid

# \* customer.subscription.updated

# \* customer.subscription.deleted

# - Copy the "Signing secret" (starts with whsec\_)

#

# 4. For local testing, use Stripe CLI:

# - Install: brew install stripe/stripe-cli/stripe

# - Login: stripe login

# - Forward webhooks: stripe listen --forward-to localhost:3000/api/donations/webhook

# - Copy the webhook secret it shows

#

# =============================================================================

# RECOMMENDED STRIPE PRODUCTS TO ENABLE

# =============================================================================

#

# 1. Stripe Payments - Basic card payments

# 2. Stripe Billing - For recurring/subscription donations

# 3. BACS Direct Debit - UK Direct Debit (requires verification)

# 4. PayPal - Additional payment option

# 5. Apple Pay / Google Pay - Mobile payments

#

# =============================================================================
