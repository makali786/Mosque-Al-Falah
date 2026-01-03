# 💰 Donation System Documentation

## Overview

This is a comprehensive multi-step donation system built with:

- **Stripe** - Payment processing (cards, recurring, Apple Pay, Google Pay)
- **Payload CMS** - Donation & donor management
- **Next.js** - Frontend forms and API routes

## Features

### 🎯 Donation Flow (5 Steps)

1. **Select** - Choose frequency, type, and amount
2. **Details** - Enter donor information
3. **Gift Aid** - UK tax relief declaration
4. **Pay** - Enter payment details via Stripe
5. **Complete** - Thank you confirmation

### 💳 Payment Methods Supported

- Credit/Debit Cards (Visa, Mastercard, Amex)
- Direct Debit (UK BACS - requires Stripe verification)
- Apple Pay
- Google Pay
- PayPal (optional integration)

### 🔄 Donation Types

- **One-off** - Single donation
- **Weekly** (Every Friday) - Weekly recurring
- **Monthly** - Monthly subscription
- **Quarterly** - Every 3 months
- **Yearly** - Annual donation

### 📊 CMS Management

All donations are tracked in Payload CMS:

- View all donations at `/admin/collections/donations`
- Manage donors at `/admin/collections/donors`
- Link donations to appeals

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js --legacy-peer-deps
```

### 2. Configure Stripe

Add these environment variables to your `.env` file:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
```

Get your keys from: https://dashboard.stripe.com/apikeys

### 3. Set Up Webhook

Create a webhook endpoint in Stripe Dashboard:

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://your-domain.com/api/donations/webhook`
4. Events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.paid`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 4. Local Webhook Testing

Use Stripe CLI for local development:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/donations/webhook

# Copy the webhook secret it displays
```

---

## File Structure

```
app/
├── (frontend)/
│   └── donate/
│       ├── page.tsx           # Main 5-step donation form
│       └── complete/
│           └── page.tsx       # Success/failure page
├── api/
│   └── donations/
│       ├── create-payment/
│       │   └── route.ts       # Create Stripe PaymentIntent/Subscription
│       └── webhook/
│           └── route.ts       # Handle Stripe webhooks

collections/
├── Donations.ts               # Donation records
├── Donors.ts                  # Donor profiles
└── DonationAppeals.ts         # Fundraising campaigns
```

---

## API Reference

### POST /api/donations/create-payment

Create a payment intent or subscription.

**Request Body:**

```json
{
  "amount": 1500,
  "currency": "GBP",
  "frequency": "one-time",
  "donationType": "general",
  "email": "donor@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "giftAid": true,
  "platformFeePercentage": 12.5
}
```

**Response:**

```json
{
  "success": true,
  "type": "payment_intent",
  "clientSecret": "pi_xxx_secret_xxx",
  "donationId": "123456"
}
```

### POST /api/donations/webhook

Stripe webhook handler. Automatically:

- Updates donation status
- Updates donor statistics
- Updates appeal funding totals

---

## Gift Aid (UK)

Gift Aid allows UK charities to claim 25% extra from HMRC on donations from UK taxpayers.

Example:

- Donor gives: £20
- Gift Aid claim: £5 (25%)
- Charity receives: £25

The system:

- Collects Gift Aid declaration
- Stores declaration date
- Calculates Gift Aid amount
- Marks donors as Gift Aid eligible

---

## Platform Fee / Tip

Optional tip to support the platform:

- Configurable percentage (0%, 10%, 12.5%, 15%)
- Shows recommended option
- Adds to total charge
- Stored separately in donation record

---

## Recurring Donations

For recurring donations, the system:

1. Creates a Stripe Price object
2. Creates a Stripe Subscription
3. Stores subscription ID on donor profile
4. Tracks active subscriptions
5. Creates new donation record for each payment

---

## Customization

### Adding New Donation Types

Edit `collections/Donations.ts`:

```typescript
{
  name: 'donationType',
  type: 'select',
  options: [
    { label: 'General Fund', value: 'general' },
    { label: 'New Type', value: 'new-type' }, // Add new option
  ],
}
```

### Customizing Quick Amounts

Edit `app/(frontend)/donate/page.tsx`:

```typescript
const quickAmounts = [15, 20, 45, 100, 250]; // Customize these
```

### Styling

The donation form uses Tailwind CSS. Customize in `app/(frontend)/donate/page.tsx`.

---

## Security Considerations

1. **Never expose Secret Key** - Only use in server-side code
2. **Validate Webhook Signatures** - Already implemented
3. **Use HTTPS** - Required for production
4. **PCI Compliance** - Stripe handles card data, we never see it

---

## Testing

### Test Card Numbers

| Card      | Number              | Result                  |
| --------- | ------------------- | ----------------------- |
| Success   | 4242 4242 4242 4242 | Payment succeeds        |
| Decline   | 4000 0000 0000 0002 | Card declined           |
| 3D Secure | 4000 0027 6000 3184 | Requires authentication |

### Test Subscription

Use card `4242 4242 4242 4242` with any future expiry date and any CVC.

---

## Troubleshooting

### Payment fails with "Invalid API Key"

- Check `STRIPE_SECRET_KEY` is set correctly
- Make sure you're using test keys in development

### Webhook returns 400

- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check webhook is pointing to correct URL - Ensure you're forwarding correctly in local development

### Donation not recorded

- Check webhook logs in Stripe Dashboard
- Look for errors in server console
- Verify Payload CMS is connected

---

## Production Checklist

- [ ] Switch to live Stripe keys
- [ ] Create production webhook endpoint
- [ ] Enable HTTPS
- [ ] Test full donation flow
- [ ] Verify Gift Aid declarations work
- [ ] Test recurring donations
- [ ] Set up email notifications
- [ ] Configure Stripe tax settings (if needed)
