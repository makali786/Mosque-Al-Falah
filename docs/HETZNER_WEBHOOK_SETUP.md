# Hetzner VPS Webhook Setup Guide

## Quick Check

Test your configuration by visiting:
```
https://masjid-alfalah.org.uk/api/webhook-diagnostic
```

You should see a JSON response showing your Stripe configuration status.

---

## Step 1: Set Environment Variables on Hetzner Server

SSH into your server and edit your environment file:

```bash
# If using PM2 with ecosystem file
nano ecosystem.config.js

# Or if using .env file
nano /path/to/your/app/.env
```

Add these lines:
```bash
# Stripe Configuration (MUST be LIVE keys for production)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

Then restart your app:
```bash
# If using PM2
pm2 restart all

# Or if using systemd
systemctl restart your-app

# Or if using Docker
docker-compose restart
```

---

## Step 2: Configure Webhook in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"** (or "+ Add destination")
3. Configure:
   - **Endpoint URL**: `https://masjid-alfalah.org.uk/api/donations/webhook`
   - **Description**: Mosque Al-Falah Webhook
4. Select events:
   - ✅ `invoice.paid` (CRITICAL for subscriptions)
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Copy the **"Signing secret"** (starts with `whsec_`)
7. Add this to your server's environment variables as `STRIPE_WEBHOOK_SECRET`

---

## Step 3: Test Webhook is Reachable

From your local machine:
```bash
curl https://masjid-alfalah.org.uk/api/webhook-diagnostic
```

Should return:
```json
{
  "status": "ok",
  "checks": {
    "stripeSecretKey": { "present": true, "mode": "LIVE" },
    "stripeWebhookSecret": { "present": true },
    ...
  }
}
```

---

## Step 4: Send Test Event from Stripe

1. In Stripe Dashboard → Webhooks → Your Endpoint
2. Click **"Send test event"**
3. Select `invoice.paid` from dropdown
4. Click **"Send test event"**
5. Check your server logs:
   ```bash
   pm2 logs
   # or
   journalctl -u your-app -f
   ```

You should see logs like:
```
📧 invoice.paid event received: { ... }
✅ Found donor: xxx@example.com
📝 Creating donation record: { ... }
✅ Donation record created: xxx
```

---

## Troubleshooting

### Issue: "Webhook not configured" error
**Cause**: `STRIPE_WEBHOOK_SECRET` not set
**Fix**: Add it to your .env file and restart

### Issue: "Invalid signature" error
**Cause**: Wrong webhook secret
**Fix**: Copy the correct signing secret from Stripe Dashboard

### Issue: Webhook not receiving events
**Cause**: URL not accessible or HTTPS issue
**Fix**: 
```bash
# Test accessibility
curl -I https://masjid-alfalah.org.uk/api/donations/webhook

# Should return HTTP 400 (not 404 or 500)
```

### Issue: Events received but no donation recorded
**Cause**: Check server logs for errors
**Fix**: 
```bash
# Watch logs in real-time
pm2 logs --lines 100

# Look for error messages in the webhook handler
```

### Issue: "Donation not found" error on webhook-test
**Cause**: Route conflict with [id] dynamic route
**Fix**: Use the new endpoint:
```
https://masjid-alfalah.org.uk/api/webhook-diagnostic
```

---

## Important: HTTPS Required

Stripe webhooks **only work with HTTPS**. If your site is HTTP-only, webhooks will fail.

Check SSL:
```bash
curl -v https://masjid-alfalah.org.uk/api/webhook-diagnostic 2>&1 | grep "SSL"
```

---

## Manual Sync (If Webhook Missed Events)

If you had subscription payments while webhook wasn't configured, run the sync script after setting up:

```bash
cd /path/to/your/app
npx tsx scripts/sync-subscription-payments.ts
```

This will check Stripe for any paid invoices not in your database and create the missing donation records.
