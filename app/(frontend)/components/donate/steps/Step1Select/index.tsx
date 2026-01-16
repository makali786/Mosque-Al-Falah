import { DonationFormData, quickAmounts } from '../../types';
import { Card } from '../../ui';
import { DonationHeader, ReviewSection, NavigationButtons } from '../../shared';
import FrequencySelector from './FrequencySelector';
import DonationTypeSelector from './DonationTypeSelector';
import AmountSelector from './AmountSelector';
import DonationBehalfCard from './DonationBehalfCard';
import PlatformFeeSection from './PlatformFeeSection';

interface Step1SelectProps {
  formData: DonationFormData;
  setFormData: (data: DonationFormData) => void;
  onNext: () => void;
}

export default function Step1Select({
  formData,
  setFormData,
  onNext,
}: Step1SelectProps) {
  const selectedAmount = formData.amount || 0;
  const isCustom = !quickAmounts.includes(selectedAmount) && selectedAmount > 0;

  const donationAmount = formData.customAmount
    ? parseFloat(formData.customAmount)
    : formData.amount;

  const platformFee = formData.platformFeeEnabled
    ? (donationAmount * formData.platformFeePercentage) / 100
    : 0;

  const totalAmount = donationAmount + platformFee;

  return (
    <div className="w-full flex flex-col gap-8 pt-8 pb-0 px-0">
      {/* Header */}
      <div className="flex flex-col gap-0 px-4 md:px-24 lg:px-96">
        <DonationHeader showBackButton={false} />
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col gap-8 items-end px-4 md:px-24 lg:px-96">
        {/* Selection Card */}
        <Card className="w-full p-8 flex flex-col gap-8">
          {/* Frequency Selector */}
          <FrequencySelector
            selectedFrequency={formData.frequency}
            onFrequencyChange={frequency =>
              setFormData({ ...formData, frequency })
            }
          />

          {/* Donation Type Selector */}
          <DonationTypeSelector
            selectedType={formData.donationType}
            onTypeChange={donationType =>
              setFormData({ ...formData, donationType })
            }
          />

          {/* Amount Selector */}
          <AmountSelector
            selectedAmount={selectedAmount}
            customAmount={formData.customAmount}
            frequency={formData.frequency}
            onAmountChange={(amount, customAmount) =>
              setFormData({ ...formData, amount, customAmount })
            }
          />
        </Card>

        {/* Donation Behalf Card */}
        <DonationBehalfCard
          isAnonymous={formData.isAnonymous}
          displayName={formData.displayName}
          donationAmount={donationAmount}
          onToggleAnonymous={() =>
            setFormData({ ...formData, isAnonymous: !formData.isAnonymous })
          }
        />

        {/* Platform Fee Section */}
        <PlatformFeeSection
          platformFeeEnabled={formData.platformFeeEnabled}
          platformFeePercentage={formData.platformFeePercentage}
          donationAmount={donationAmount}
          onPlatformFeeChange={(enabled, percentage) =>
            setFormData({
              ...formData,
              platformFeeEnabled: enabled,
              platformFeePercentage: percentage,
            })
          }
        />

        {/* Review Section */}
        <ReviewSection
          donationAmount={donationAmount}
          platformFeeEnabled={formData.platformFeeEnabled}
          platformFeePercentage={formData.platformFeePercentage}
          platformFee={platformFee}
          totalAmount={totalAmount}
        />

        {/* Navigation Buttons */}
        <NavigationButtons
          onNext={onNext}
          nextDisabled={donationAmount <= 0}
          showBack={false}
        />
      </div>
    </div>
  );
}
