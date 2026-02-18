/**
 * Apple Sign-In for donation flow
 *
 * Uses NextAuth's signIn('apple') which handles the full OAuth redirect flow,
 * token exchange, and callback automatically via the .p8 private key JWT.
 */

declare global {
  interface Window {
    AppleID: any;
  }
}

/**
 * Initialize Apple Sign-In (no-op — NextAuth handles initialization)
 * Kept for backward compatibility with SocialLoginSection.
 */
export function initializeAppleSignIn(
  onSuccess?: () => void,
  onError?: (error: any) => void
) {
  // NextAuth handles Apple OAuth — no client-side SDK initialization needed.
  // The onSuccess/onError callbacks are not used in the NextAuth flow.
}

/**
 * Trigger Apple Sign-In via NextAuth.
 *
 * Redirects the user to Apple's OAuth page. After authentication, Apple
 * redirects back to /api/auth/callback/apple which NextAuth handles.
 * The user is then redirected to the callbackUrl.
 */
export async function signInWithApple(
  onSuccess?: () => void,
  onError?: (error: any) => void
) {
  try {
    // Dynamically import to avoid SSR issues
    const { signIn } = await import('next-auth/react');

    // Redirect back to the current page after Apple sign-in
    const callbackUrl =
      typeof window !== 'undefined' ? window.location.href : '/donate';

    await signIn('apple', { callbackUrl });
  } catch (error) {
    console.error('Apple sign-in error:', error);
    if (onError) {
      onError(error);
    }
  }
}

/**
 * Handle Apple Sign-In callback response (used server-side by NextAuth).
 * This is kept for reference — NextAuth handles this automatically via
 * the signIn callback in auth-options.ts.
 */
export function handleAppleCallbackResponse(response: any): {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
} {
  if (!response || !response.authorization) {
    throw new Error('No authorization received from Apple');
  }

  // Parse the ID token to get user info
  const userData = parseAppleJwt(response.authorization.id_token);

  // Apple only provides user name on the FIRST sign-in
  const firstName = response.user?.name?.firstName || userData.given_name || '';
  const lastName = response.user?.name?.lastName || userData.family_name || '';
  const email = response.user?.email || userData.email || '';
  const name = `${firstName} ${lastName}`.trim() || userData.name || '';

  return { email, firstName, lastName, name };
}

/**
 * Parse Apple JWT token (id_token)
 */
function parseAppleJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing Apple JWT:', error);
    throw error;
  }
}
