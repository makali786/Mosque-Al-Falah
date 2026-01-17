/**
 * Simple Google Sign-In for donation flow
 * Just gets user info and stores in localStorage
 */

import { saveUserData } from './userStorage';

declare global {
  interface Window {
    google: any;
    handleGoogleCredentialResponse: any;
  }
}

/**
 * Initialize Google Sign-In with One Tap
 */
export function initializeGoogleSignIn(onSuccess?: () => void, onError?: (error: any) => void) {
  // Check if script already exists
  if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
    return;
  }

  // Load Google Identity Services script
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;

  script.onload = () => {
    try {
      if (window.google) {
        // Store callbacks in window for Google to access
        window.handleGoogleCredentialResponse = (response: any) => {
          handleGoogleCallback(response, onSuccess, onError);
        };

        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: window.handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  script.onerror = (error) => {
    console.error('Error loading Google Sign-In script:', error);
    if (onError) {
      onError(error);
    }
  };

  document.body.appendChild(script);
}

/**
 * Handle Google Sign-In callback
 */
function handleGoogleCallback(response: any, onSuccess?: () => void, onError?: (error: any) => void) {
  try {
    if (!response || !response.credential) {
      throw new Error('No credential received from Google');
    }

    // Decode JWT token to get user info
    const userData = parseJwt(response.credential);

    console.log('Google user data:', userData);

    // Save to localStorage
    saveUserData({
      email: userData.email || '',
      firstName: userData.given_name || '',
      lastName: userData.family_name || '',
      name: userData.name || '',
      picture: userData.picture,
    });

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('Error handling Google sign-in:', error);
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
    throw error;
  }
}

/**
 * Trigger Google Sign-In popup
 */
export function signInWithGoogle() {
  try {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      // Show the One Tap prompt
      window.google.accounts.id.prompt((notification: any) => {
        console.log('Google One Tap notification:', notification);

        // If One Tap is not displayed, fall back to popup
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('One Tap not displayed, showing popup...');
          // We'll need to render a button for popup - Google requires it
          renderGoogleButton();
        }
      });
    } else {
      console.error('Google Sign-In not initialized');
      alert('Google Sign-In is not ready. Please refresh the page and try again.');
    }
  } catch (error) {
    console.error('Error triggering Google sign-in:', error);
    alert('Failed to open Google Sign-In. Please try again.');
  }
}

/**
 * Render Google Sign-In button (fallback for popup)
 */
function renderGoogleButton() {
  // Create a temporary container
  let container = document.getElementById('google-signin-temp-button');
  if (!container) {
    container = document.createElement('div');
    container.id = 'google-signin-temp-button';
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '10000';
    container.style.backgroundColor = 'white';
    container.style.padding = '20px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(container);
  }

  // Render Google button
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      width: 250,
    });

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '5px';
    closeBtn.style.right = '5px';
    closeBtn.style.border = 'none';
    closeBtn.style.background = 'none';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#666';
    closeBtn.onclick = () => {
      if (container) {
        document.body.removeChild(container);
      }
    };
    container.appendChild(closeBtn);

    // Auto-close after successful sign-in
    const originalCallback = window.handleGoogleCredentialResponse;
    window.handleGoogleCredentialResponse = (response: any) => {
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
      originalCallback(response);
    };
  }
}
