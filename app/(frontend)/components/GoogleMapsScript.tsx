'use client';

import { useEffect } from 'react';

export default function GoogleMapsScript() {
  useEffect(() => {
    // Check if script is already loaded
    if (window.google?.maps?.places) {
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      'AIzaSyCloYI-01X0XUgQQ4BwTeF1Kl8MEZpWbrc';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  return null;
}
