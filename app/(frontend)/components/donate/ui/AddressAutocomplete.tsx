'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface AddressComponents {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
}

interface AddressAutocompleteProps {
  value: string;
  onAddressSelect: (address: AddressComponents) => void;
  onInputChange: (value: string) => void;
}

export default function AddressAutocomplete({
  value,
  onAddressSelect,
  onInputChange,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Wait for Google Maps to load
    const initAutocomplete = () => {
      if (!window.google?.maps?.places || !inputRef.current) {
        setTimeout(initAutocomplete, 100);
        return;
      }

      try {
        // Initialize Google Places Autocomplete
        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['address'],
            fields: ['address_components', 'formatted_address'],
          }
        );

        // Listen for place selection
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (!place?.address_components) return;

          // Parse address components
          const addressComponents: AddressComponents = {
            line1: '',
            line2: '',
            city: '',
            postcode: '',
            country: 'GB', // Default to GB
          };

          place.address_components.forEach((component: any) => {
            const types = component.types;

            if (types.includes('street_number')) {
              addressComponents.line1 = component.long_name;
            } else if (types.includes('route')) {
              addressComponents.line1 =
                (addressComponents.line1 ? addressComponents.line1 + ' ' : '') +
                component.long_name;
            } else if (
              types.includes('locality') ||
              types.includes('postal_town')
            ) {
              addressComponents.city = component.long_name;
            } else if (types.includes('postal_code')) {
              addressComponents.postcode = component.long_name;
            } else if (
              types.includes('subpremise') ||
              types.includes('premise')
            ) {
              addressComponents.line2 = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              // For addresses without locality, use admin area as city
              if (!addressComponents.city) {
                addressComponents.city = component.long_name;
              }
            }
          });

          // Always force country to GB regardless of actual location
          addressComponents.country = 'GB';

          console.log('Parsed address components:', addressComponents);

          // Pass parsed address back to parent with all components
          onAddressSelect(addressComponents);
        });
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
      }
    };

    initAutocomplete();

    // Inject custom styles for Google Places dropdown
    const injectStyles = () => {
      if (document.getElementById('google-places-custom-styles')) return;

      const style = document.createElement('style');
      style.id = 'google-places-custom-styles';
      style.textContent = `
        /* Override Google Places Autocomplete dropdown styles */
        .pac-container {
          background-color: #FFFFFF;
          border: 1px solid #E4E4E7;
          border-radius: 12px;
          box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1);
          margin-top: 4px;
          padding: 4px;
          font-family: inherit;
          z-index: 9999 !important;
        }

        .pac-container:after {
          display: none;
        }

        .pac-item {
          border: none;
          padding: 12px 16px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.15s ease;
          font-family: inherit;
          line-height: 1.5;
        }

        .pac-item:hover {
          background-color: #F4F4F5;
        }

        .pac-item-selected {
          background-color: #F4F4F5;
        }

        .pac-matched {
          font-weight: 600;
          color: #18181B;
        }

        .pac-item-query {
          font-size: 16px;
          color: #11181C;
          font-weight: 500;
        }

        .pac-item span {
          font-size: 14px;
          color: #52525B;
        }

        .pac-icon {
          display: none;
        }

        .pac-icon-marker {
          display: none;
        }

        .pac-logo:after {
          display: none;
        }
      `;
      document.head.appendChild(style);
    };

    injectStyles();

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onAddressSelect, onInputChange]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col h-17.5 items-start min-w-29 w-full">
        <div className="flex items-center pb-3 pr-2 w-full">
          <p className="text-xs font-normal leading-4 text-[#52525B]">
            Find your address
          </p>
          <div className="flex flex-col h-3.5 items-center justify-center pl-0.5 w-1.75">
            <p className="text-sm font-normal leading-5 text-[#F31260]">*</p>
          </div>
        </div>
        <div className="bg-[#F4F4F5] flex items-center min-h-8 px-1.5 py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full relative">
          <div className="overflow-hidden w-5 h-5 relative shrink-0">
            <Image
              src="/assets/donation/search-address.svg"
              alt="Search"
              width={20}
              height={20}
              className="absolute inset-[2%]"
            />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => onInputChange(e.target.value)}
            placeholder="Start typing your address"
            className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
