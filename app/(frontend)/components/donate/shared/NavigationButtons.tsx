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
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-8 w-full sm:w-auto shrink-0">
      {showBack && (
        <Button
          onClick={onBack}
          variant="disabled"
          className="w-full sm:w-auto sm:min-w-[212px]"
        >
          Previous
        </Button>
      )}
      {onNext && (
        <Button
          onClick={onNext}
          variant="primary"
          disabled={nextDisabled}
          className="w-full sm:w-auto sm:min-w-[212px]"
        >
          {nextText}
        </Button>
      )}
    </div>
  );
}
