'use client';

import { useEffect } from 'react';

export default function GoogleMapsScript() {
  useEffect(() => {
    console.log('GoogleMapsScript - Component mounted');

    // Check if already loaded
    if ((window as any).google?.maps) {
      console.log('GoogleMapsScript - Already loaded');
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );

    if (existingScript) {
      console.log('GoogleMapsScript - Script tag already exists');
      return;
    }

    console.log('GoogleMapsScript - Creating script tag...');

    // Load Google Maps script
    const script = document.createElement('script');
    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      'AIzaSyCloYI-01X0XUgQQ4BwTeF1Kl8MEZpWbrc';

    // Simple URL without callback - let it load naturally
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = false; // Load synchronously to ensure it's available
    script.defer = false;

    script.onload = () => {
      console.log('GoogleMapsScript - Script loaded successfully');
      console.log('GoogleMapsScript - window.google:', (window as any).google);
    };

    script.onerror = (error) => {
      console.error('GoogleMapsScript - Failed to load script:', error);
    };

    console.log('GoogleMapsScript - Appending script to head');
    document.head.appendChild(script);
  }, []);

  return null;
}
