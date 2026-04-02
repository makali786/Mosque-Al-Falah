import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const revalidate = 60;

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    
    const settings = await payload.findGlobal({
      slug: 'donation-settings',
      depth: 1,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching donation settings:', error);
    
    // Return default values if fetching fails
    return NextResponse.json(
      {
        quickAmounts: [{ amount: 15 }, { amount: 20 }, { amount: 45 }],
        defaultAmount: {
          defaultSelectedAmount: 20,
          minimumDonation: 1,
        },
        platformFee: {
          enabledByDefault: true,
          defaultPercentage: 12.5,
          sliderPoints: [
            { visualPosition: 0, percentageValue: 0 },
            { visualPosition: 25, percentageValue: 7.5 },
            { visualPosition: 50, percentageValue: 12.5 },
            { visualPosition: 75, percentageValue: 17.5 },
            { visualPosition: 100, percentageValue: 20 },
          ],
          recommendedPosition: 50,
          infoText: '75% of donors',
          infoSubtext: 'have helped keep Masjid System free for our charity in last the 24 hours',
        },
        donationTypes: [
          { value: 'general', label: 'General Fund' },
          { value: 'zakat', label: 'Zakat' },
          { value: 'sadaqah', label: 'Sadaqah' },
          { value: 'building', label: 'Building Fund' },
          { value: 'ramadan', label: 'Ramadan Appeal' },
          { value: 'gaza', label: 'Gaza Emergency' },
          { value: 'orphan', label: 'Orphan Support' },
          { value: 'education', label: 'Education' },
        ],
        frequencies: [
          { value: 'one-time', label: 'One-off' },
          { value: 'weekly', label: 'Every Friday' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly' },
          { value: 'yearly', label: 'Yearly' },
        ],
        uiText: {
          amountSelectorLabel: 'Your giving amount',
          customAmountButtonText: 'Custom',
          customAmountPlaceholder: 'Enter amount',
          applyButtonText: 'Apply',
        },
      },
      { status: 200 }
    );
  }
}
