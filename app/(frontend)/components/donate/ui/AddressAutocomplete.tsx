'use client';

import { useEffect, useRef, useState } from 'react';
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
  defaultValue?: string;
  value?: AddressComponents;
}

export default function AddressAutocomplete({
  onAddressSelect,
  defaultValue = '',
  value,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(!!value?.line1);
  const [manualAddress, setManualAddress] = useState({
    line1: value?.line1 || '',
    line2: value?.line2 || '',
    city: value?.city || '',
    postcode: value?.postcode || '',
  });

  // Keep manual address in sync with props
  useEffect(() => {
    if (value) {
      setManualAddress({
        line1: value.line1 || '',
        line2: value.line2 || '',
        city: value.city || '',
        postcode: value.postcode || '',
      });
      if (value.line1 && !showManualEntry) {
        setShowManualEntry(true);
      }
    }
  }, [value]);

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
            // Removing types: ['address'] to allow searching by postal_code
            // Restricting to GB for better UK postcode mapping
            componentRestrictions: { country: 'gb' },
            fields: ['address_components', 'formatted_address'],
          }
        );

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();

          if (!place?.address_components) {
            return;
          }

          // Extract components
          let streetNumber = '';
          let route = '';
          let locality = '';
          let postalTown = '';
          let adminArea1 = '';
          let adminArea2 = '';
          let postcode = '';

          place.address_components.forEach((component: google.maps.GeocoderAddressComponent) => {
            const types = component.types;

            if (types.includes('street_number')) streetNumber = component.long_name;
            if (types.includes('route')) route = component.long_name;
            if (types.includes('locality')) locality = component.long_name;
            if (types.includes('postal_town')) postalTown = component.long_name;
            if (types.includes('administrative_area_level_1')) adminArea1 = component.long_name;
            if (types.includes('administrative_area_level_2')) adminArea2 = component.long_name;

            // Handle both full postal code and prefix/prefix-matching
            if (types.includes('postal_code')) postcode = component.long_name;
            if (types.includes('postal_code_prefix') && !postcode) postcode = component.long_name;
          });

          // Accurate Line 1 construction from thoroughfare (street_number + route)
          let line1 = '';
          if (streetNumber && route) {
            line1 = `${streetNumber} ${route}`;
          } else if (route) {
            line1 = route;
          } else {
            // Fallback to splitting formatted_address if exact street/route missing
            const formatted = place.formatted_address || '';
            const parts = formatted.split(',').map(p => p.trim());
            if (parts.length >= 3) {
              line1 = parts.slice(0, -2).join(', ');
            } else if (parts.length > 0) {
              line1 = parts[0];
            }
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

          // Automatically switch to manual entry and pre-fill form
          setManualAddress({
            line1: result.line1,
            line2: result.line2,
            city: result.city,
            postcode: result.postcode,
          });
          setShowManualEntry(true);
          onAddressSelect(result);
        });
      } catch (error) {
        // Silent fail
      }
    };

    if (!showManualEntry) {
      initAutocomplete();
    } else if (autocompleteRef.current) {
      // Clear autocomplete if we switch to manual entry
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }

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
  }, [onAddressSelect, showManualEntry]);

  const handleManualAddressChange = (field: keyof typeof manualAddress, value: string) => {
    const updated = { ...manualAddress, [field]: value };
    setManualAddress(updated);
    onAddressSelect({
      ...updated,
      country: 'GB',
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {!showManualEntry ? (
        <>
          {/* Google Places Autocomplete */}
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
                defaultValue={defaultValue}
                placeholder="Start typing your address"
                className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
              />
            </div>
          </div>

          {/* Toggle to Manual Entry */}
          <button
            type="button"
            onClick={() => setShowManualEntry(true)}
            className="font-normal leading-5 text-xs hover:underline text-left cursor-pointer"
          >
            Enter address manually
          </button>
        </>
      ) : (
        <>
          {/* Manual Entry Fields */}
          <div className="flex flex-col gap-4 w-full">
            {/* Address Line 1 */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center">
                <p className="text-xs font-normal leading-4 text-[#52525B]">
                  Address Line 1
                </p>
                <div className="flex flex-col h-3.5 items-center justify-center pl-0.5 w-1.75">
                  <p className="text-sm font-normal leading-5 text-[#F31260]">*</p>
                </div>
              </div>
              <input
                type="text"
                value={manualAddress.line1}
                onChange={(e) => handleManualAddressChange('line1', e.target.value)}
                placeholder="e.g. 123 Main Street"
                className="bg-[#F4F4F5] px-4 py-3 rounded-xl text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none focus:ring-2 focus:ring-[#006FEE]"
              />
            </div>

            {/* Address Line 2 */}
            <div className="flex flex-col gap-2 w-full">
              <p className="text-xs font-normal leading-4 text-[#52525B]">
                Address Line 2 (optional)
              </p>
              <input
                type="text"
                value={manualAddress.line2}
                onChange={(e) => handleManualAddressChange('line2', e.target.value)}
                placeholder="e.g. Apartment 4B"
                className="bg-[#F4F4F5] px-4 py-3 rounded-xl text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none focus:ring-2 focus:ring-[#006FEE]"
              />
            </div>

            {/* City and Postcode Row */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* City */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center">
                  <p className="text-xs font-normal leading-4 text-[#52525B]">
                    City
                  </p>
                  <div className="flex flex-col h-3.5 items-center justify-center pl-0.5 w-1.75">
                    <p className="text-sm font-normal leading-5 text-[#F31260]">*</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={manualAddress.city}
                  onChange={(e) => handleManualAddressChange('city', e.target.value)}
                  placeholder="e.g. London"
                  className="bg-[#F4F4F5] px-4 py-3 rounded-xl text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none focus:ring-2 focus:ring-[#006FEE]"
                />
              </div>

              {/* Postcode */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center">
                  <p className="text-xs font-normal leading-4 text-[#52525B]">
                    Postcode
                  </p>
                  <div className="flex flex-col h-3.5 items-center justify-center pl-0.5 w-1.75">
                    <p className="text-sm font-normal leading-5 text-[#F31260]">*</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={manualAddress.postcode}
                  onChange={(e) => handleManualAddressChange('postcode', e.target.value)}
                  placeholder="e.g. SW1A 1AA"
                  className="bg-[#F4F4F5] px-4 py-3 rounded-xl text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none focus:ring-2 focus:ring-[#006FEE]"
                />
              </div>
            </div>
          </div>

          {/* Toggle back to Autocomplete */}
          <button
            type="button"
            onClick={() => setShowManualEntry(false)}
            className="text-xs font-normal leading-5 hover:underline text-left cursor-pointer"
          >
            Use address search instead
          </button>
        </>
      )}
    </div>
  );
}
