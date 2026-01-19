const steps = [
  { number: 1, label: 'Select' },
  { number: 2, label: 'Details' },
  { number: 3, label: 'Gift Aid' },
  { number: 4, label: 'Pay' },
  { number: 5, label: 'Complete' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full bg-[#F4F4F5] border border-[#E6F1FE] border-solid">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 px-4 lg:px-8 py-3">
        {steps.map(step => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-center gap-2 py-3.5">
              {/* Badge with number */}
              <div
                className={`
                  flex items-center justify-center
                  h-6 min-w-6 px-1
                  rounded-full
                  border-2 border-white border-solid
                  ${isActive || isCompleted ? 'bg-[#006FEE]' : 'bg-[#D4D4D8]'}
                `}
              >
                <span
                  className={`
                    text-sm font-normal leading-5 text-center
                    ${isActive || isCompleted ? 'text-white' : 'text-black'}
                  `}
                >
                  {step.number}
                </span>
              </div>

              {/* Step label */}
              <span
                className={`
                  text-sm lg:text-base font-medium leading-6 text-center whitespace-nowrap
                  ${isActive ? 'text-[#18181B]' : 'text-[#52525B]'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile view - show only current step */}
      <div className="md:hidden flex items-center justify-center px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Current step badge */}
          <div className="flex items-center justify-center h-6 min-w-6 px-1 rounded-full border-2 border-white border-solid bg-[#006FEE]">
            <span className="text-sm font-normal leading-5 text-center text-white">
              {currentStep}
            </span>
          </div>

          {/* Current step label */}
          <span className="text-base font-medium leading-6 text-[#18181B]">
            {steps.find(s => s.number === currentStep)?.label}
          </span>

          {/* Progress indicator */}
          <span className="text-sm text-[#52525B] ml-2">
            ({currentStep} of {steps.length})
          </span>
        </div>
      </div>
    </div>
  );
}
