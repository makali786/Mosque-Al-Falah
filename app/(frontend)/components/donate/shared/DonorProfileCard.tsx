'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface DonorProfileCardProps {
  donationAmount?: number;
  showAmount?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
  onProfileChange?: (isAnonymous: boolean, displayName: string) => void;
}

export default function DonorProfileCard({
  donationAmount = 0,
  showAmount = true,
  className = '',
  variant = 'default',
  onProfileChange,
}: DonorProfileCardProps) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [tempIsAnonymous, setTempIsAnonymous] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedIsAnonymous = localStorage.getItem('donor_is_anonymous');
    const storedDisplayName = localStorage.getItem('donor_display_name');

    if (storedIsAnonymous !== null) {
      const anonymous = storedIsAnonymous === 'true';
      setIsAnonymous(anonymous);
      setTempIsAnonymous(anonymous);
    }

    if (storedDisplayName) {
      setDisplayName(storedDisplayName);
      setTempDisplayName(storedDisplayName);
    }
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('donor_is_anonymous', String(isAnonymous));
    if (displayName) {
      localStorage.setItem('donor_display_name', displayName);
    }

    // Call parent callback if provided
    if (onProfileChange) {
      onProfileChange(isAnonymous, displayName);
    }
  }, [isAnonymous, displayName, onProfileChange]);

  const handleEdit = () => {
    setTempDisplayName(displayName);
    setTempIsAnonymous(isAnonymous);
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setIsAnonymous(tempIsAnonymous);
    setDisplayName(tempDisplayName);
    setIsEditModalOpen(false);
  };

  const handleCancel = () => {
    setTempDisplayName(displayName);
    setTempIsAnonymous(isAnonymous);
    setIsEditModalOpen(false);
  };

  const displayedName = isAnonymous ? 'Anonymous kind soul' : displayName || 'Anonymous kind soul';

  return (
    <>
      {/* Profile Card */}
      <div className={`bg-[#F4F4F5] flex items-center justify-between px-3 py-2 rounded-lg w-full gap-2 ${className}`}>
        <div className="flex gap-2 items-center flex-1 min-w-0">
          <div className="bg-[#A1A1AA] flex items-center justify-center overflow-hidden rounded-full w-10 h-10 flex-shrink-0">
            <img
              alt="Avatar"
              className="w-4/5 h-4/5 object-contain"
              src="/assets/donation/avatar-default.png"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <p className={`font-normal text-[#11181C] truncate ${variant === 'compact' ? 'text-xs' : 'text-sm'} leading-5`}>
              {displayedName}
            </p>
            {showAmount && (
              <p className={`font-normal text-[#A1A1AA] truncate ${variant === 'compact' ? 'text-[10px]' : 'text-xs'} leading-4`}>
                £{donationAmount.toFixed(2)} GBP, a few moments ago
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleEdit}
          className={`cursor-pointer flex h-10 items-center justify-center px-3 sm:px-4 rounded-xl hover:bg-black/5 transition-colors flex-shrink-0`}
        >
          <p className={`font-normal leading-5 text-black ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
            Edit
          </p>
        </button>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#11181C]">Edit Donor Profile</h2>
              <button
                onClick={handleCancel}
                className="text-[#71717A] hover:text-[#11181C] transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#F4F4F5] rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#11181C]">Donate Anonymously</p>
                  <p className="text-xs text-[#71717A] mt-1">
                    Hide your name from public donations
                  </p>
                </div>
                <button
                  onClick={() => setTempIsAnonymous(!tempIsAnonymous)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006FEE] focus:ring-offset-2 ${
                    tempIsAnonymous ? 'bg-[#006FEE]' : 'bg-[#D4D4D8]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      tempIsAnonymous ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Display Name Input */}
              {!tempIsAnonymous && (
                <div className="space-y-2">
                  <label htmlFor="displayName" className="text-sm font-medium text-[#11181C]">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={tempDisplayName}
                    onChange={(e) => setTempDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    className="w-full px-4 py-3 bg-[#F4F4F5] border border-[#D4D4D8] rounded-xl text-base text-[#11181C] placeholder:text-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#006FEE] focus:border-transparent"
                  />
                  <p className="text-xs text-[#71717A]">
                    This name will appear on donation lists
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-[#F4F4F5] text-[#11181C] rounded-xl font-medium hover:bg-[#E4E4E7] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-[#006FEE] text-white rounded-xl font-medium hover:bg-[#0055CC] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
