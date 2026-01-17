/**
 * Simple Apple Sign-In for donation flow
 * Just gets user info and stores in localStorage
 */

import AppleSignin from 'react-apple-signin-auth';
import { saveUserData } from './userStorage';

/**
 * Initialize Apple Sign-In (no initialization needed for this library)
 */
export function initializeAppleSignIn(onSuccess?: () => void, onError?: (error: any) => void) {
  // No initialization needed - the library handles everything
  console.log('Apple Sign-In ready');
}

/**
 * Handle Apple Sign-In callback
 */
function handleAppleCallback(response: any, onSuccess?: () => void, onError?: (error: any) => void) {
  try {
    if (!response || !response.authorization) {
      throw new Error('No authorization received from Apple');
    }

    // Apple response structure:
    // response.authorization.id_token - JWT token
    // response.user (only on first sign-in) - { name: { firstName, lastName }, email }

    // Parse the ID token to get user info
    const userData = parseAppleJwt(response.authorization.id_token);

    // If this is the first sign-in, Apple provides user name
    const firstName = response.user?.name?.firstName || userData.given_name || '';
    const lastName = response.user?.name?.lastName || userData.family_name || '';
    const email = response.user?.email || userData.email || '';
    const name = `${firstName} ${lastName}`.trim() || userData.name || '';

    // Save to localStorage
    saveUserData({
      email: email,
      firstName: firstName,
      lastName: lastName,
      name: name,
      picture: undefined, // Apple doesn't provide profile picture
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
 * Parse Apple JWT token
 */
function parseAppleJwt(token: string): any {
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
    console.error('Error parsing Apple JWT:', error);
    throw error;
  }
}

/**
 * Trigger Apple Sign-In popup
 */
export function signInWithApple(onSuccess?: () => void, onError?: (error: any) => void) {
  try {
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

  // Create Apple button manually
  const appleButton = document.createElement('button');
  appleButton.textContent = 'Continue with Apple';
  appleButton.style.width = '300px';
  appleButton.style.padding = '12px 24px';
  appleButton.style.backgroundColor = '#000000';
  appleButton.style.color = 'white';
  appleButton.style.border = 'none';
  appleButton.style.borderRadius = '6px';
  appleButton.style.fontSize = '16px';
  appleButton.style.fontWeight = '600';
  appleButton.style.cursor = 'pointer';
  appleButton.style.transition = 'background-color 0.2s';
  appleButton.onmouseover = () => {
    appleButton.style.backgroundColor = '#333333';
  };
  appleButton.onmouseout = () => {
    appleButton.style.backgroundColor = '#000000';
  };
  appleButton.onclick = () => {
    handleAppleSignIn(onSuccess, onError);
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

/**
 * Handle Apple Sign-In using the library
 */
function handleAppleSignIn(onSuccess?: () => void, onError?: (error: any) => void) {
  // This needs to be implemented using the react-apple-signin-auth library
  // The library requires a React component, so we'll trigger it programmatically

  // Create a temporary container for the Apple Sign-In component
  const tempContainer = document.createElement('div');
  tempContainer.style.display = 'none';
  document.body.appendChild(tempContainer);

  // Dynamically import and render the Apple Sign-In component
  import('react').then((React) => {
    import('react-dom/client').then((ReactDOM) => {
      const root = ReactDOM.createRoot(tempContainer);

      const AppleSignInButton = React.createElement(AppleSignin, {
        authOptions: {
          clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
          scope: 'email name',
          redirectURI: typeof window !== 'undefined' ? window.location.origin : '',
          state: 'state',
          nonce: 'nonce',
          usePopup: true,
        },
        onSuccess: (response: any) => {
          handleAppleCallback(response, onSuccess, onError);
          root.unmount();
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
        },
        onError: (error: any) => {
          console.error('Apple sign-in error:', error);
          if (onError) {
            onError(error);
          }
          root.unmount();
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
        },
      });

      root.render(AppleSignInButton);

      // Trigger the click programmatically
      setTimeout(() => {
        const appleButton = tempContainer.querySelector('button');
        if (appleButton) {
          appleButton.click();
        }
      }, 100);
    });
  });
}
