export interface DonationFormData {
  // Step 1: Select
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  donationType: string;
  appealId?: string; // Optional: links donation to a specific appeal
  amount: number;
  customAmount: string;
  platformFeeEnabled: boolean;
  platformFeePercentage: number;

  // Step 2: Details
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    postcode: string;
    country: string;
  };
  isAnonymous: boolean;
  displayName: string;
  marketingConsent: boolean;
  termsAccepted: boolean;

  // Step 3: Gift Aid
  giftAidEnabled: boolean;
  giftAidDeclaration: boolean;
}

// Default values - used as fallbacks when CMS settings are not available
export const defaultFrequencies = [
  { value: 'one-time', label: 'One-off' },
  { value: 'weekly', label: 'Every Friday' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
] as const;

export const defaultDonationTypes = [
  { value: 'general', label: 'General Fund' },
  { value: 'zakat', label: 'Zakat' },
  { value: 'sadaqah', label: 'Sadaqah' },
  { value: 'building', label: 'Building Fund' },
  { value: 'ramadan', label: 'Ramadan Appeal' },
  { value: 'gaza', label: 'Gaza Emergency' },
  { value: 'orphan', label: 'Orphan Support' },
  { value: 'education', label: 'Education' },
] as const;

export const defaultQuickAmounts = [15, 20, 45] as const;

// Keep old exports for backward compatibility during migration
export const frequencies = defaultFrequencies;
export const donationTypes = defaultDonationTypes;
export const quickAmounts = defaultQuickAmounts;

// Donation Settings from CMS
export interface QuickAmount {
  amount: number;
  id?: string;
}

export interface DonationType {
  value: string;
  label: string;
  id?: string;
}

export interface FrequencyOption {
  value: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  label: string;
  id?: string;
}

export interface SliderPoint {
  visualPosition: number;
  percentageValue: number;
  id?: string;
}

export interface PlatformFeeSettings {
  enabledByDefault: boolean;
  defaultPercentage: number;
  sliderPoints: SliderPoint[];
  recommendedPosition: number;
  infoText: string;
  infoSubtext: string;
}

export interface DefaultAmountSettings {
  defaultSelectedAmount: number;
  minimumDonation: number;
}

export interface UITextSettings {
  amountSelectorLabel: string;
  customAmountButtonText: string;
  customAmountPlaceholder: string;
  applyButtonText: string;
}

export interface DonationSettings {
  quickAmounts: QuickAmount[];
  defaultAmount: DefaultAmountSettings;
  platformFee: PlatformFeeSettings;
  donationTypes: DonationType[];
  frequencies: FrequencyOption[];
  uiText: UITextSettings;
  id?: string;
  globalType?: string;
  createdAt?: string;
  updatedAt?: string;
}
