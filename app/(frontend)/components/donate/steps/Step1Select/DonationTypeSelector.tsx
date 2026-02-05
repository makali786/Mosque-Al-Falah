'use client';

import { useState, useEffect } from 'react';
import { donationTypes } from '../../types';

interface Appeal {
  id: string;
  title: string;
  slug: string;
  category: string;
  funding?: {
    targetAmount?: number;
    currentAmount?: number;
  };
}

interface DonationTypeSelectorProps {
  selectedType: string;
  selectedAppealId?: string;
  onTypeChange: (type: string, appealId?: string) => void;
}

export default function DonationTypeSelector({
  selectedType,
  selectedAppealId,
  onTypeChange,
}: DonationTypeSelectorProps) {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch active donation appeals
  useEffect(() => {
    const fetchAppeals = async () => {
      try {
        const response = await fetch('/api/donation-appeals?limit=100&where[isActive][equals]=true');
        const data = await response.json();
        if (data.docs) {
          setAppeals(data.docs);
        }
      } catch (error) {
        console.error('Failed to fetch donation appeals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppeals();
  }, []);

  const handleChange = (value: string) => {
    // Check if user selected an appeal (format: "appeal:ID")
    if (value.startsWith('appeal:')) {
      const appealId = value.replace('appeal:', '');
      const appeal = appeals.find(a => a.id === appealId);
      if (appeal) {
        // Use the appeal's category as donation type
        onTypeChange(appeal.category || 'general', appealId);
      }
    } else {
      // Regular donation type selected, clear appealId
      onTypeChange(value, undefined);
    }
  };

  // Determine current value for the select
  const currentValue = selectedAppealId
    ? `appeal:${selectedAppealId}`
    : selectedType;

  return (
    <div className="flex flex-col gap-[4px] items-start w-full">
      <div className="flex flex-col items-start min-w-[116px] w-full">
        <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[12px] py-[10px] rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
          <div className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-start justify-center h-full px-[6px] pb-[2px] pt-0 min-h-px min-w-px">
              <div className="flex items-center pr-[8px] pl-0 py-0 w-full">
                <p className="text-[12px] font-normal leading-[16px] text-[#52525B]">
                  Donation Type / Appeal
                </p>
              </div>
              <div className="flex items-center w-full">
                <select
                  value={currentValue}
                  onChange={e => handleChange(e.target.value)}
                  className="w-full bg-transparent text-[16px] font-normal leading-[24px] text-[#11181C] border-none outline-none appearance-none"
                  disabled={loading}
                >
                  {/* General donation types */}
                  <optgroup label="General Donation Types">
                    {donationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </optgroup>

                  {/* Active Appeals */}
                  {appeals.length > 0 && (
                    <optgroup label="Active Campaigns">
                      {appeals.map(appeal => (
                        <option key={appeal.id} value={`appeal:${appeal.id}`}>
                          {appeal.title}
                          {appeal.funding?.targetAmount &&
                            ` (Goal: £${appeal.funding.targetAmount.toLocaleString()})`}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>
          </div>
          <svg
            className="w-[16px] h-[16px] shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#11181C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
