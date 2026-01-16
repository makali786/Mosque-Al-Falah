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
  onAddressSelect: (address: AddressComponents) => void;
}

export default function AddressAutocomplete({
  onAddressSelect,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    let mounted = true;

    const initAutocomplete = () => {
      if (!mounted) return;

      if (!window.google?.maps?.places || !inputRef.current) {
        setTimeout(initAutocomplete, 100);
        return;
      }

      // Don't reinitialize if already set up
      if (autocompleteRef.current) return;

      try {
        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['address'],
            fields: ['address_components', 'formatted_address'],
          }
        );

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();

          if (!place?.address_components) {
            return;
          }

          // Extract components
          let locality = '';
          let postalTown = '';
          let adminArea1 = '';
          let adminArea2 = '';
          let postcode = '';

          place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
            const types = component.types;

            if (types.includes('locality')) locality = component.long_name;
            if (types.includes('postal_town')) postalTown = component.long_name;
            if (types.includes('administrative_area_level_1')) adminArea1 = component.long_name;
            if (types.includes('administrative_area_level_2')) adminArea2 = component.long_name;
            if (types.includes('postal_code')) postcode = component.long_name;
            if (types.includes('postal_code_prefix') && !postcode) postcode = component.long_name;
          });

          // Build line1 from formatted address - take everything before city
          const formatted = place.formatted_address || '';
          const parts = formatted.split(',').map(p => p.trim());

          // line1: first part(s) before city/region
          // For "4475 Rue Garand, Saint-Laurent, QC, Canada" -> "4475 Rue Garand, Saint-Laurent"
          let line1 = '';
          if (parts.length >= 3) {
            // Take all except last 2 (region + country)
            line1 = parts.slice(0, -2).join(', ');
          } else if (parts.length === 2) {
            line1 = parts[0];
          } else {
            line1 = formatted;
          }

          // City: prefer postal_town, then locality, then admin areas
          const city = postalTown || locality || adminArea2 || adminArea1 || '';

          const result: AddressComponents = {
            line1: line1,
            line2: '',
            city: city,
            postcode: postcode,
            country: 'GB',
          };

          onAddressSelect(result);
        });
      } catch (error) {
        // Silent fail
      }
    };

    initAutocomplete();

    // Inject styles
    if (!document.getElementById('pac-styles')) {
      const style = document.createElement('style');
      style.id = 'pac-styles';
      style.textContent = `
        .pac-container {
          background: #fff;
          border: 1px solid #E4E4E7;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          margin-top: 4px;
          padding: 4px;
          z-index: 9999 !important;
        }
        .pac-container:after { display: none; }
        .pac-item {
          border: none;
          padding: 12px 16px;
          cursor: pointer;
          border-radius: 8px;
        }
        .pac-item:hover { background: #F4F4F5; }
        .pac-item-selected { background: #F4F4F5; }
        .pac-icon, .pac-icon-marker { display: none; }
        .pac-logo:after { display: none; }
      `;
      document.head.appendChild(style);
    }

    return () => {
      mounted = false;
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [onAddressSelect]);

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
            placeholder="Start typing your address"
            className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
          />
        </div>
      </div>
    </div>
  );
}
