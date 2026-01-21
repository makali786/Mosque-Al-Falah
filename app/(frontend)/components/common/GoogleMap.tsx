'use client';

import { useEffect, useRef, useState } from 'react';

interface GoogleMapProps {
  address?: string;
  className?: string;
  height?: string;
  zoom?: number;
}

export default function GoogleMap({
  address = '',
  className = '',
  height = '198px',
  zoom = 15,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!address || !mapRef.current) {
      setIsLoading(false);
      return;
    }

    const initMap = () => {
      // Check if Google Maps is loaded
      if (!(window as any).google?.maps) {
        setTimeout(initMap, 100);
        return;
      }

      const google = (window as any).google;
      const geocoder = new google.maps.Geocoder();

      // Geocode the address
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0] && mapRef.current) {
          const location = results[0].geometry.location;

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

          setIsLoading(false);
        } else {
          console.error('Geocode failed:', status);
          setError(true);
          setIsLoading(false);
        }
      });
    };

    initMap();
  }, [address, zoom]);

  if (!address) {
    return (
      <div
        className={`bg-[#E4E4E7] flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <span className="text-gray-500 text-sm">Map unavailable</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-[#E4E4E7] flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <span className="text-gray-500 text-sm">Unable to load map</span>
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
