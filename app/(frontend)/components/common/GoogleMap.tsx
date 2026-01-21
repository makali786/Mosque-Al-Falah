'use client';

import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
    latitude?: number;
    longitude?: number;
    address?: string;
  className?: string;
  height?: string;
  zoom?: number;
}

export default function GoogleMap({
    latitude,
    longitude,
    address = 'Location',
  className = '',
  height = '198px',
  zoom = 15,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
      console.log('GoogleMap - Coordinates:', { latitude, longitude, address });

      if ((!latitude || !longitude) || !mapRef.current) {
        console.log('GoogleMap - Missing coordinates or ref');
      setIsLoading(false);
        setError(!latitude || !longitude);
      return;
    }

      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max wait

    const initMap = () => {
        attempts++;

      // Check if Google Maps is loaded
      if (!(window as any).google?.maps) {
          if (attempts < maxAttempts) {
              console.log(`GoogleMap - Waiting for API... (attempt ${attempts}/${maxAttempts})`);
            setTimeout(initMap, 100);
        } else {
            console.error('GoogleMap - Timeout waiting for Google Maps API');
            console.error('GoogleMap - window.google:', (window as any).google);
            setError(true);
            setIsLoading(false);
        }
        return;
      }

        try {
          console.log('GoogleMap - Initializing map with:', { latitude, longitude });
          const google = (window as any).google;
          const location = { lat: latitude, lng: longitude };

          // Create map
          const map = new google.maps.Map(mapRef.current, {
              center: location,
              zoom: zoom,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
              styles: [
                  {
                      featureType: 'poi',
                      elementType: 'labels',
                      stylers: [{ visibility: 'off' }],
                  },
              ],
          });

          // Add marker
          new google.maps.Marker({
              position: location,
              map: map,
              title: address,
              animation: google.maps.Animation.DROP,
          });

          console.log('GoogleMap - Map initialized successfully');
          setIsLoading(false);
      } catch (err) {
          console.error('GoogleMap - Error initializing map:', err);
          setError(true);
          setIsLoading(false);
      }
    };

    initMap();
  }, [latitude, longitude, address, zoom]);

    if (!latitude || !longitude) {
    return (
      <div
        className={`bg-[#E4E4E7] flex items-center justify-center ${className}`}
        style={{ height }}
      >
            <span className="text-gray-500 text-sm">Map unavailable - No coordinates provided</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-[#E4E4E7] flex items-center justify-center ${className}`}
        style={{ height }}
      >
            <div className="flex flex-col items-center gap-2 p-4 text-center">
                <span className="text-gray-500 text-sm">Unable to load map</span>
                <span className="text-gray-400 text-xs">Please refresh the page</span>
            </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#E4E4E7] flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#006FEE] rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500">Loading map...</span>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden" />
    </div>
  );
}
