/**
 * Simple Facebook Login for donation flow
 * Just gets user info and stores in localStorage
 */

import { saveUserData } from './userStorage';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: any;
    handleFacebookCallback: any;
  }
}

/**
 * Initialize Facebook SDK
 */
export function initializeFacebookSDK(onSuccess?: () => void, onError?: (error: any) => void) {
  // Check if script already exists
  if (document.getElementById('facebook-jssdk')) {
    return;
  }

  // Define FB initialization
  window.fbAsyncInit = function() {
    if (window.FB) {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });

      console.log('Facebook SDK initialized successfully');
    }
  };

  // Load Facebook SDK script
  (function(d, s, id) {
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    const js = d.createElement(s) as HTMLScriptElement;
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode?.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}

/**
 * Handle Facebook callback
 */
function handleFacebookCallback(onSuccess?: () => void, onError?: (error: any) => void) {
  if (!window.FB) {
    console.error('Facebook SDK not loaded');
    if (onError) {
      onError(new Error('Facebook SDK not loaded'));
    }
    return;
  }

  window.FB.login(function(response: any) {
    if (response.authResponse) {
      // Get user data
      window.FB.api('/me', { fields: 'id,name,email,first_name,last_name,picture' }, function(userData: any) {
        if (userData && !userData.error) {
          console.log('Facebook user info:', userData);

          // Save to localStorage
          saveUserData({
            email: userData.email || '',
            firstName: userData.first_name || userData.name?.split(' ')[0] || '',
            lastName: userData.last_name || userData.name?.split(' ').slice(1).join(' ') || '',
            name: userData.name || '',
            picture: userData.picture?.data?.url,
          });

          // Close the popup if it exists
          const popup = document.getElementById('facebook-signin-popup');
          if (popup && document.body.contains(popup)) {
            document.body.removeChild(popup);
          }

          if (onSuccess) {
            onSuccess();
          }
        } else {
          console.error('Error getting Facebook user data:', userData?.error);
          if (onError) {
            onError(userData?.error || new Error('Failed to get user data'));
          }
        }
      });
    } else {
      console.log('Facebook login cancelled');
      if (onError) {
        onError(new Error('Login cancelled'));
      }
    }
  }, { scope: 'public_profile,email' });
}

/**
 * Trigger Facebook Sign-In popup
 */
export function signInWithFacebook(onSuccess?: () => void, onError?: (error: any) => void) {
  try {
    if (!window.FB) {
      console.error('Facebook SDK not initialized');
      alert('Facebook Sign-In is not ready. Please refresh the page and try again.');
      return;
    }

    // Show the Facebook Sign-In popup
    renderFacebookButton(onSuccess, onError);
  } catch (error) {
    console.error('Error triggering Facebook sign-in:', error);
    alert('Failed to open Facebook Sign-In. Please try again.');
  }
}

/**
 * Render Facebook Sign-In button in a modal popup
 */
function renderFacebookButton(onSuccess?: () => void, onError?: (error: any) => void) {
  // Remove existing popup if any
  const existingPopup = document.getElementById('facebook-signin-popup');
  if (existingPopup) {
    document.body.removeChild(existingPopup);
  }

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.id = 'facebook-signin-popup';
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
  title.textContent = 'Sign in with Facebook';
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
  buttonContainer.id = 'facebook-signin-button-container';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'center';

  // Create Facebook button manually
  const fbButton = document.createElement('button');
  fbButton.textContent = 'Continue with Facebook';
  fbButton.style.width = '300px';
  fbButton.style.padding = '12px 24px';
  fbButton.style.backgroundColor = '#1877f2';
  fbButton.style.color = 'white';
  fbButton.style.border = 'none';
  fbButton.style.borderRadius = '6px';
  fbButton.style.fontSize = '16px';
  fbButton.style.fontWeight = '600';
  fbButton.style.cursor = 'pointer';
  fbButton.style.transition = 'background-color 0.2s';
  fbButton.onmouseover = () => {
    fbButton.style.backgroundColor = '#166fe5';
  };
  fbButton.onmouseout = () => {
    fbButton.style.backgroundColor = '#1877f2';
  };
  fbButton.onclick = () => {
    handleFacebookCallback(onSuccess, onError);
  };

  buttonContainer.appendChild(fbButton);
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
 * Export function to show Facebook login popup
 */
export function showFacebookLoginPopup(onSuccess?: () => void, onError?: (error: any) => void) {
  signInWithFacebook();
}
