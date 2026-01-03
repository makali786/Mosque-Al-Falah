# 🔐 Social Login & Email Setup

## Overview

This document explains how to configure social login (Google, Apple, Facebook) and email notifications for the donation system.

---

## NextAuth.js Configuration

### Required Environment Variables

Add these to your `.env` file:

```bash
# NextAuth.js Core
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth
APPLE_CLIENT_ID=your-apple-service-id
APPLE_CLIENT_SECRET=your-apple-private-key

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Email (Magic Link & Receipts)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM="Masjid Al-Falah <donations@masjid-al-falah.org>"
```

---

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the "Google+ API"

### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in:
   - App name: "Masjid Al-Falah Donations"
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if in testing mode

### 3. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://your-domain.com`
5. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`
6. Copy the **Client ID** and **Client Secret**

---

## Apple Sign In Setup

### 1. Apple Developer Account

You need an Apple Developer account ($99/year).

### 2. Create App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. **Certificates, Identifiers & Profiles** → **Identifiers**
3. Create a new **App ID**
4. Enable **Sign in with Apple**

### 3. Create Services ID

1. Create a new **Services ID**
2. Enable **Sign in with Apple**
3. Configure domains:
   - Domain: `your-domain.com`
   - Return URLs: `https://your-domain.com/api/auth/callback/apple`

### 4. Create Private Key

1. **Keys** → Create new key
2. Enable **Sign in with Apple**
3. Download the `.p8` file
4. Generate the client secret using the key:

```bash
# Use this to generate APPLE_CLIENT_SECRET
# The secret expires after 6 months
```

The `APPLE_CLIENT_SECRET` is a JWT signed with your private key.

---

## Facebook Login Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app → **Consumer** type
3. Add **Facebook Login** product

### 2. Configure Facebook Login

1. Go to **Facebook Login** → **Settings**
2. Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook`
   - `https://your-domain.com/api/auth/callback/facebook`
3. Enable "Enforce HTTPS"

### 3. Get Credentials

1. Go to **Settings** → **Basic**
2. Copy **App ID** → `FACEBOOK_CLIENT_ID`
3. Copy **App Secret** → `FACEBOOK_CLIENT_SECRET`

### 4. Permissions Required

- `email`
- `public_profile`

---

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - **2-Step Verification** → **App passwords**
   - Create app password for "Mail"
3. Use the app password as `EMAIL_SERVER_PASSWORD`

```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-gmail@gmail.com
EMAIL_SERVER_PASSWORD=your-16-char-app-password
```

### Custom SMTP (e.g., SendGrid, Mailgun)

```bash
# SendGrid
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your-sendgrid-api-key

# Mailgun
EMAIL_SERVER_HOST=smtp.mailgun.org
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=postmaster@your-domain.mailgun.org
EMAIL_SERVER_PASSWORD=your-mailgun-password
```

---

## Email Templates

### Available Email Templates

| Template           | Function                          | Description                      |
| ------------------ | --------------------------------- | -------------------------------- |
| Donation Receipt   | `sendDonationReceipt()`           | Sent after successful payment    |
| Welcome Email      | `sendWelcomeEmail()`              | Sent to new donors               |
| Recurring Reminder | `sendRecurringDonationReminder()` | Sent before subscription charges |

### Template Features

- **Beautiful HTML design** with inline CSS
- **Responsive** for mobile devices
- **Gift Aid display** for UK donors
- **Hadith quotes** for spiritual touch
- **Plain text fallback** for email clients without HTML support

### Customizing Templates

Edit `/lib/email/email-service.ts` to customize:

- Logo and branding
- Colors and styling
- Content and messaging
- Footer information

---

## Testing Social Login

### Local Development

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/donate/login`

3. Test each provider:
   - Google: Works with localhost
   - Apple: Requires HTTPS (use ngrok for local testing)
   - Facebook: Works with localhost

### Using ngrok for Apple Sign In

```bash
# Install ngrok
brew install ngrok

# Start tunnel
ngrok http 3000

# Use the HTTPS URL for Apple callback
```

---

## Troubleshooting

### "Invalid redirect_uri" Error

- Check that your callback URLs match exactly
- Include both HTTP and HTTPS versions
- No trailing slashes

### Emails Not Sending

- Check SMTP credentials
- Verify firewall allows outbound port 587
- Check spam folder
- Enable "Less secure apps" if using basic Gmail

### Session Not Persisting

- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear cookies and try again

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Store secrets securely (environment variables)
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Rotate Apple client secret before expiry (6 months)
- [ ] Review OAuth scopes (request minimum needed)
- [ ] Enable OAuth app verification for production
