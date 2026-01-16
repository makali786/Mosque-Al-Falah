import { Button } from '../ui';

interface NavigationButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextText?: string;
  showBack?: boolean;
}

export default function NavigationButtons({
  onNext,
  onBack,
  nextDisabled = false,
  nextText = 'Next',
  showBack = true,
}: NavigationButtonsProps) {
  return (
    <div className="flex gap-8 shrink-0">
      {showBack && (
        <Button
          onClick={onBack}
          variant="disabled"
          className="w-[212px]"
        >
          Previous
        </Button>
      )}
      {onNext && (
        <Button
          onClick={onNext}
          variant="primary"
          disabled={nextDisabled}
          className="w-[212px]"
        >
          {nextText}
        </Button>
      )}
    </div>
  );
}
