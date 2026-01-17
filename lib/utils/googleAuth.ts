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
 * Initialize Google Sign-In
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

        console.log('Google Sign-In initialized successfully');
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

    // Save to localStorage
    saveUserData({
      email: userData.email || '',
      firstName: userData.given_name || '',
      lastName: userData.family_name || '',
      name: userData.name || '',
      picture: userData.picture,
    });

    // Close the popup if it exists
    const popup = document.getElementById('google-signin-popup');
    if (popup && document.body.contains(popup)) {
      document.body.removeChild(popup);
    }

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
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error('Google Sign-In not initialized');
      alert('Google Sign-In is not ready. Please refresh the page and try again.');
      return;
    }

    // Show the Google Sign-In popup directly
    renderGoogleButton();
  } catch (error) {
    console.error('Error triggering Google sign-in:', error);
    alert('Failed to open Google Sign-In. Please try again.');
  }
}

/**
 * Render Google Sign-In button in a modal popup
 */
function renderGoogleButton() {
  // Remove existing popup if any
  const existingPopup = document.getElementById('google-signin-popup');
  if (existingPopup) {
    document.body.removeChild(existingPopup);
  }

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.id = 'google-signin-popup';
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
  title.textContent = 'Sign in with Google';
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
  buttonContainer.id = 'google-signin-button-container';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'center';
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

  // Render Google button
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.renderButton(buttonContainer, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      width: 300,
      logo_alignment: 'left',
    });
  }
}
