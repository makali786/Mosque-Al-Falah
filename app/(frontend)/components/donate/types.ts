export interface DonationFormData {
  // Step 1: Select
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  donationType: string;
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

export const frequencies = [
  { value: 'one-time', label: 'One-off' },
  { value: 'weekly', label: 'Every Friday' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
] as const;

export const donationTypes = [
  { value: 'general', label: 'General Fund' },
  { value: 'zakat', label: 'Zakat' },
  { value: 'sadaqah', label: 'Sadaqah' },
  { value: 'building', label: 'Building Fund' },
  { value: 'ramadan', label: 'Ramadan Appeal' },
  { value: 'gaza', label: 'Gaza Emergency' },
  { value: 'orphan', label: 'Orphan Support' },
  { value: 'education', label: 'Education' },
] as const;

export const quickAmounts = [15, 20, 45] as const;
