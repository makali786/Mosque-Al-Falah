/**
 * Simple Apple Sign-In for donation flow
 * Just gets user info and stores in localStorage
 */

import { saveUserData } from './userStorage';

declare global {
  interface Window {
    AppleID: any;
  }
}

/**
 * Initialize Apple Sign-In
 */
/**
 * Helper to initialize Apple SDK
 */
function initAppleSDK() {
  try {
    if (window.AppleID) {
      window.AppleID.auth.init({
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
        scope: 'name email',
        redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || window.location.origin,
        usePopup: true,
      });
      console.log('Apple Sign-In initialized (lazy check)');
    }
  } catch (error) {
    console.error('Error initializing Apple SDK:', error);
  }
}

/**
 * Initialize Apple Sign-In
 */
export function initializeAppleSignIn(onSuccess?: () => void, onError?: (error: any) => void) {
  
  // Check if script already exists
  if (document.querySelector('script[src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"]')) {
    // If script exists, try to initialize immediately if object is ready
    if (window.AppleID) {
      initAppleSDK();
    }
    // Even if window.AppleID isn't ready, we can't add the script again. 
    // The button click handler has a backup init call.
    return;
  }

  // Load Apple Sign-In script
  const script = document.createElement('script');
  script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
  script.async = true;
  script.defer = true;

  script.onload = () => {
    initAppleSDK();
  };

  script.onerror = (error) => {
    console.error('Error loading Apple Sign-In script:', error);
    if (onError) {
      onError(error);
    }
  };

  document.body.appendChild(script);
}

/**
 * Handle Apple Sign-In response
 */
function handleAppleResponse(response: any, onSuccess?: () => void, onError?: (error: any) => void) {
  try {
    if (!response || !response.authorization) {
      throw new Error('No authorization received from Apple');
    }

    // Decode ID token to get email
    const idToken = response.authorization.id_token;
    const jwtClaims = parseJwt(idToken);
    
    // User info is only returned on first sign-in
    // We try to use what we have, prioritizing the direct user object if available
    const user = response.user;
    
    const email = user?.email || jwtClaims.email || '';
    const firstName = user?.name?.firstName || '';
    const lastName = user?.name?.lastName || '';
    
    // Save to localStorage
    saveUserData({
      email,
      firstName,
      lastName,
      name: firstName && lastName ? `${firstName} ${lastName}` : '',
      // Apple doesn't typically provide a picture URL in this flow
    });

    // Close the popup if it exists
    const popup = document.getElementById('apple-signin-popup');
    if (popup && document.body.contains(popup)) {
      document.body.removeChild(popup);
    }

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('Error handling Apple sign-in:', error);
    if (onError) {
      onError(error);
    }
  }
}

/**
 * Parse JWT token
 */
function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return {};
  }
}

/**
 * Trigger Apple Sign-In popup
 */
export function signInWithApple(onSuccess?: () => void, onError?: (error: any) => void) {
  try {
    if (!window.AppleID) {
      console.error('Apple Sign-In not initialized');
      alert('Apple Sign-In is not ready. Please refresh the page and try again.');
      return;
    }

    // Show the Apple Sign-In popup
    renderAppleButton(onSuccess, onError);
  } catch (error) {
    console.error('Error triggering Apple sign-in:', error);
    alert('Failed to open Apple Sign-In. Please try again.');
  }
}

/**
 * Render Apple Sign-In button in a modal popup
 */
function renderAppleButton(onSuccess?: () => void, onError?: (error: any) => void) {
  // Remove existing popup if any
  const existingPopup = document.getElementById('apple-signin-popup');
  if (existingPopup) {
    document.body.removeChild(existingPopup);
  }

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.id = 'apple-signin-popup';
  backdrop.style.position = 'fixed';
  backdrop.style.top = '0';
  backdrop.style.left = '0';
  backdrop.style.right = '0';
  backdrop.style.bottom = '0';
  backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  backdrop.style.zIndex = '10000';
  backdrop.style.display = 'flex';
  backdrop.style.alignItems = 'center';
  backdrop.style.justifyContent = 'center';
  backdrop.style.padding = '20px';

  // Create container for button
  const container = document.createElement('div');
  container.style.backgroundColor = 'white';
  container.style.padding = '40px';
  container.style.borderRadius = '12px';
  container.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
  container.style.maxWidth = '400px';
  container.style.width = '100%';
  container.style.position = 'relative';

  // Add title
  const title = document.createElement('h2');
  title.textContent = 'Sign in with Apple';
  title.style.margin = '0 0 20px 0';
  title.style.fontSize = '24px';
  title.style.fontWeight = '600';
  title.style.color = '#1f2937';
  title.style.textAlign = 'center';
  container.appendChild(title);

  // Add subtitle
  const subtitle = document.createElement('p');
  subtitle.textContent = 'Sign in to auto-fill your donation details';
  subtitle.style.margin = '0 0 30px 0';
  subtitle.style.fontSize = '14px';
  subtitle.style.color = '#6b7280';
  subtitle.style.textAlign = 'center';
  container.appendChild(subtitle);

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'apple-signin-button-container';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'center';

  // Create custom Apple button
  const appleButton = document.createElement('button');
  appleButton.textContent = 'Sign in with Apple';
  appleButton.style.width = '300px';
  appleButton.style.padding = '12px 24px';
  appleButton.style.backgroundColor = '#000000';
  appleButton.style.color = 'white';
  appleButton.style.border = 'none';
  appleButton.style.borderRadius = '6px';
  appleButton.style.fontSize = '16px';
  appleButton.style.fontWeight = '500';
  appleButton.style.cursor = 'pointer';
  appleButton.style.display = 'flex';
  appleButton.style.alignItems = 'center';
  appleButton.style.justifyContent = 'center';
  appleButton.style.gap = '8px';
  appleButton.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  
  // Apple Icon (SVG)
  const iconSvg = `<svg viewBox="0 0 384 512" width="16" height="16" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/></svg>`;
  appleButton.innerHTML = `${iconSvg} Sign in with Apple`;

  appleButton.onclick = async () => {
    try {
      const response = await window.AppleID.auth.signIn();
      handleAppleResponse(response, onSuccess, onError);
    } catch (error) {
      console.error('Apple Sign-In failed:', error);
      if (onError) onError(error);
    }
  };

  buttonContainer.appendChild(appleButton);
  container.appendChild(buttonContainer);

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '10px';
  closeBtn.style.border = 'none';
  closeBtn.style.background = 'none';
  closeBtn.style.fontSize = '28px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.color = '#9ca3af';
  closeBtn.style.lineHeight = '1';
  closeBtn.style.padding = '0';
  closeBtn.style.width = '32px';
  closeBtn.style.height = '32px';
  closeBtn.onmouseover = () => {
    closeBtn.style.color = '#1f2937';
  };
  closeBtn.onmouseout = () => {
    closeBtn.style.color = '#9ca3af';
  };
  closeBtn.onclick = () => {
    if (document.body.contains(backdrop)) {
      document.body.removeChild(backdrop);
    }
  };
  container.appendChild(closeBtn);

  backdrop.appendChild(container);
  document.body.appendChild(backdrop);

  // Close on backdrop click
  backdrop.onclick = (e) => {
    if (e.target === backdrop) {
      document.body.removeChild(backdrop);
    }
  };
}
