# Google Sign-In Setup for Donation Flow

This guide will help you set up Google Sign-In for the donation flow.

## What's Been Implemented

The Google Sign-In functionality has been implemented with the following features:

1. **Social Login Buttons** - Google, Apple, and Facebook sign-in buttons on Step 2 of the donation flow
2. **Local Storage Integration** - User data (email, first name, last name) is automatically saved to local storage after Google Sign-In
3. **Auto-Fill Forms** - The donation form on Step 2 automatically fills with the user's information
4. **Donor Profile Card** - Shows the signed-in user's name in the donation flow

## Files Modified/Created

### Created:
- `lib/utils/userStorage.ts` - Utility functions for managing user data in localStorage

### Modified:
- `app/(frontend)/layout.tsx` - Added AuthProvider wrapper
- `app/(frontend)/components/donate/shared/SocialLoginSection.tsx` - Added session handling and localStorage integration
- `app/(frontend)/components/donate/steps/Step2Details/index.tsx` - Added auto-fill from Google Sign-In data
- `app/(frontend)/components/donate/shared/DonorProfileCard.tsx` - Added support for Google Sign-In data

## Setup Instructions

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen:
   - User Type: External
   - App name: Mosque Al-Falah
   - User support email: your email
   - Developer contact: your email
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: Mosque Al-Falah Donations
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://your-production-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-production-domain.com/api/auth/callback/google` (for production)
7. Copy the **Client ID** and **Client Secret**

### 2. Update Environment Variables

Add the following to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth
NEXTAUTH_SECRET=generate-a-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

**Important:**
- For `NEXTAUTH_SECRET`, generate a secure random string. You can use: `openssl rand -base64 32`
- For production, update `NEXTAUTH_URL` to your production domain

### 3. Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the donation page: `http://localhost:3000/donate`

3. Go to Step 2 (Details page)

4. Click the Google sign-in button

5. Complete the Google authentication flow

6. Your email, first name, and last name should automatically populate in the form

7. The donor profile card should show your name

## How It Works

### Flow Diagram

```
User clicks Google Sign-In
    ↓
NextAuth handles OAuth flow with Google
    ↓
User authenticates with Google
    ↓
Google returns user data (email, name, picture)
    ↓
Session is created via NextAuth
    ↓
SocialLoginSection detects session change
    ↓
User data is saved to localStorage (donation_user_data)
    ↓
Step2Details auto-fills form fields
    ↓
DonorProfileCard displays user's name
```

### Local Storage Structure

The user data is stored in localStorage with the key `donation_user_data`:

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "name": "John Doe",
  "picture": "https://..."
}
```

## Apple and Facebook Sign-In

The implementation also supports Apple and Facebook sign-in. To enable them:

### Apple Sign-In
Add to `.env`:
```env
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret
```

### Facebook Sign-In
Add to `.env`:
```env
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

## Troubleshooting

### Issue: "Configuration" error
- Make sure all environment variables are set correctly
- Restart your development server after adding environment variables

### Issue: Redirect URI mismatch
- Ensure the redirect URI in Google Cloud Console matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check that `NEXTAUTH_URL` is set correctly in `.env`

### Issue: Form not auto-filling
- Check browser console for errors
- Verify that localStorage has the `donation_user_data` key after sign-in
- Make sure the AuthProvider is wrapping your app in `layout.tsx`

### Issue: User data not persisting
- Check that you're not in incognito/private browsing mode
- Verify that localStorage is enabled in your browser
- Check browser console for localStorage errors

## Security Notes

1. **Never commit** your `.env` file to version control
2. **Use different credentials** for development and production
3. **Rotate secrets** regularly in production
4. The implementation only stores user data locally for the donation flow - no sensitive data is persisted on the server without explicit user action

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth Google Provider](https://next-auth.js.org/providers/google)
