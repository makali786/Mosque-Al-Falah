import { CountdownTime } from '@hooks/useCountdown';
import { DateInfo, PrayerTime } from '@hooks/usePrayerTimes';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

// ============================================================================
// Countdown Display Component
// ============================================================================

interface CountdownDisplayProps {
  countdown: CountdownTime;
  prayerName: string;
  variant?: 'default' | 'large';
}

export const CountdownDisplay = ({
  countdown,
  prayerName,
  variant = 'default',
}: CountdownDisplayProps) => {
  const timeUnits = [
    { value: countdown.hours, label: 'Hours' },
    { value: countdown.minutes, label: 'Minutes' },
    { value: countdown.seconds, label: 'Seconds' },
  ];

  const sizing =
    variant === 'large'
      ? {
        container:
          'xl:w-93.5 lg:w-85 sm:w-72 w-[calc(100%-2rem)] xl:p-6 lg:p-5 md:p-4 p-4',
        titleText:
          'xl:text-lg lg:text-base md:text-base text-sm xl:leading-7 lg:leading-6 md:leading-6 leading-5',
        titleGap: 'xl:gap-2 lg:gap-1.5 gap-1',
        countdownText:
          'xl:text-5xl lg:text-4xl md:text-3xl text-2xl xl:leading-12 lg:leading-11 md:leading-10 leading-8',
        digitWidth: 'xl:w-17 lg:w-15 md:w-12 w-10',
        colonPadding: 'xl:px-1 lg:px-0.5 px-0.5',
        labelGap: 'xl:gap-3.5 lg:gap-2.5 gap-1.5',
        labelHeight: 'xl:h-6.25 lg:h-5.5 md:h-5 h-4',
        labelWidth: 'xl:w-17 lg:w-15 md:w-12 w-10',
        labelText:
          'xl:text-sm lg:text-xs md:text-xs text-[10px] xl:leading-5 lg:leading-4 leading-3',
      }
      : {
        container: 'lg:w-93.5 md:w-72 w-[calc(100%-2rem)] lg:p-6 md:p-4 p-4',
        titleText:
          'lg:text-lg md:text-base text-sm text-[#fafafa] text-center lg:leading-7 md:leading-6 leading-5',
        titleGap: 'lg:gap-2 gap-1',
        countdownText:
          'lg:text-5xl md:text-3xl text-2xl lg:leading-12 md:leading-10 leading-8',
        digitWidth: 'lg:w-17 md:w-12 w-10',
        colonPadding: 'lg:px-1 px-0.5',
        labelGap: 'lg:gap-3.5 gap-1.5',
        labelHeight: 'lg:h-6.25 md:h-5 h-4',
        labelWidth: 'lg:w-17 md:w-12 w-10',
        labelText: 'lg:text-sm md:text-xs text-[10px] lg:leading-5 leading-3',
      };

  return (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${sizing.container} backdrop-blur-[6.65px] bg-[#18181b]/80 flex flex-col gap-0 items-center rounded-[14px]`}
      style={{ backdropFilter: 'blur(6.65px)' }}
    >
      <div className="flex flex-col md:gap-2 gap-1 items-center">
        {/* Timer Title */}
        <div
          className={`flex ${sizing.titleGap} items-center ${sizing.titleText} text-[#fafafa] text-center`}
        >
          <p className="font-normal">The Athan of</p>
          <p className="font-semibold">{prayerName}</p>
          <p className="font-normal">is in</p>
        </div>

        {/* Countdown Display */}
        <div className="flex flex-col gap-1 items-start w-full">
          <div
            className={`flex items-center justify-center ${sizing.countdownText} font-semibold text-[#fafafa] w-full`}
          >
            {timeUnits.map((unit, index) => (
              <div key={unit.label} className="flex items-center">
                <div
                  className={`flex justify-center text-center ${sizing.digitWidth}`}
                >
                  <p>{unit.value}</p>
                </div>
                {index < timeUnits.length - 1 && (
                  <div
                    className={`flex justify-center text-center ${sizing.colonPadding}`}
                  >
                    <p>:</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Labels */}
          <div
            className={`flex ${sizing.labelGap} items-center w-full justify-center`}
          >
            {timeUnits.map(unit => (
              <div
                key={unit.label}
                className={`bg-[#27272a] ${sizing.labelHeight} rounded-lg overflow-hidden shrink-0 ${sizing.labelWidth} flex items-center justify-center`}
              >
                <p className={`${sizing.labelText} font-normal text-[#a1a1aa]`}>
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Date Navigation Component
// ============================================================================

interface DateNavigationProps {
  dateInfo: DateInfo;
  onPrevious: () => void;
  onNext: () => void;
  variant?: 'default' | 'large' | 'compact';
}

export const DateNavigation = ({
  dateInfo,
  onPrevious,
  onNext,
  variant = 'default',
}: DateNavigationProps) => {
  const variants = {
    default: {
      container:
        'absolute lg:top-31.75 md:top-24 top-4 left-1/2 -translate-x-1/2 flex items-center justify-between lg:w-81.5 md:w-72 w-[calc(100%-2rem)] z-10',
      buttonSize: 'md:w-8 md:h-8 w-6 h-6',
      iconSize: 'md:w-6 md:h-6 w-5 h-5',
      textColor: 'text-white',
      dateWidth: 'lg:w-42.5 md:w-36 flex-1',
      gregorianText:
        'lg:text-sm md:text-xs text-xs font-semibold text-[#fafafa] md:leading-5 leading-4',
      hijriText: 'text-xs font-medium text-[#006fee] leading-4',
    },
    large: {
      container:
        'absolute xl:top-31.75 top-8 left-1/2 -translate-x-1/2 flex items-center justify-between xl:w-81.5 lg:w-85 md:w-72 w-[calc(100%-2rem)] z-10',
      buttonSize: 'md:w-8 md:h-8 w-6 h-6',
      iconSize: 'md:w-6 md:h-6 w-5 h-5',
      textColor: 'text-white',
      dateWidth: 'lg:w-42.5 md:w-36 flex-1',
      gregorianText:
        'lg:text-sm md:text-xs text-xs font-semibold text-[#fafafa] md:leading-5 leading-4',
      hijriText: 'text-xs font-medium text-[#006fee] leading-4',
    },
    compact: {
      container: 'flex items-center justify-between w-full',
      buttonSize: 'w-8 h-8',
      iconSize: 'w-6 h-6',
      textColor: 'text-black',
      dateWidth: 'w-42.5 whitespace-nowrap',
      gregorianText: 'font-semibold text-sm leading-5 text-black',
      hijriText: 'font-medium text-xs leading-4 text-[#006fee]',
    },
  };

  const styles = variants[variant];

  return (
    <div className={styles.container}>
      <button
        onClick={onPrevious}
        className={`${styles.buttonSize} shrink-0 flex items-center justify-center ${styles.textColor} hover:text-[#006fee] transition-colors cursor-pointer`}
        aria-label="Previous day"
      >
        <IoChevronBack className={styles.iconSize} />
      </button>

      <div
        className={`flex flex-col gap-1 items-center text-center ${styles.dateWidth}`}
      >
        <p className={`${styles.gregorianText} w-full`}>{dateInfo.gregorian}</p>
        <p className={`${styles.hijriText} w-full`}>{dateInfo.hijri}</p>
      </div>

      <button
        onClick={onNext}
        className={`${styles.buttonSize} shrink-0 flex items-center justify-center ${styles.textColor} hover:text-[#006fee] transition-colors cursor-pointer`}
        aria-label="Next day"
      >
        <IoChevronForward className={styles.iconSize} />
      </button>
    </div>
  );
};

// ============================================================================
// Prayer Time Row Component
// ============================================================================

interface PrayerTimeRowProps {
  prayer: PrayerTime;
  variant?: 'default' | 'compact';
}

export const PrayerTimeRow = ({
  prayer,
  variant = 'default',
}: PrayerTimeRowProps) => {
  const isActive = prayer.isActive;
  const bgColor = isActive
    ? 'bg-[#18181b] border border-[#18181b]'
    : 'bg-[#fafafa]';
  const nameColor = isActive ? 'text-white' : 'text-black';
  const labelColor = isActive ? 'text-white' : 'text-[#71717a]';
  const timeColor = isActive ? 'text-white' : 'text-[#006fee]';

  const spacing = variant === 'compact' ? '' : 'mb-1';

  return (
    <div
      className={`${bgColor} flex items-center justify-between overflow-hidden md:px-4 px-3 md:py-3.5 py-3 rounded-lg w-full ${spacing}`}
    >
      <p
        className={`md:text-base text-sm font-bold ${nameColor} md:leading-6 leading-5 md:w-24 w-16`}
      >
        {prayer.name}
      </p>

      <div className="flex gap-1 items-center text-nowrap md:w-24 flex-1 justify-end">
        <p
          className={`md:text-xs text-[10px] font-normal ${labelColor} md:leading-4 leading-3`}
        >
          Begins
        </p>
        <p
          className={`md:text-base text-sm font-bold ${timeColor} md:leading-6 leading-5`}
        >
          {prayer.begins}
        </p>
      </div>

      <div
        className={`flex gap-1 items-center text-nowrap md:w-24 flex-1 justify-end ${!prayer.jamaah ? 'opacity-0' : ''
          }`}
      >
        <p
          className={`md:text-xs text-[10px] font-normal ${labelColor} md:leading-4 leading-3`}
        >
          Jama&apos;ah
        </p>
        <p
          className={`md:text-base text-sm font-bold ${timeColor} md:leading-6 leading-5`}
        >
          {prayer.jamaah || prayer.begins}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// Jumu'ah Time Row Component
// ============================================================================

interface JumuahTimeRowProps {
  jumuah: PrayerTime;
  variant?: 'default' | 'compact';
}

export const JumuahTimeRow = ({
  jumuah,
  variant = 'default',
}: JumuahTimeRowProps) => {
  const isActive = jumuah.isActive || false;
  const spacing = variant === 'compact' ? '' : 'mb-1';

  return (
    <div
      className={`flex items-center justify-between overflow-hidden md:px-4 px-3 md:py-3.5 py-3 rounded-lg w-full ${spacing} ${isActive ? 'bg-[#006fee] border border-[#006fee]' : 'bg-[#fafafa]'
        }`}
    >
      <p
        className={`md:text-base text-sm font-bold md:leading-6 leading-5 md:w-24 w-16 ${isActive ? 'text-white' : 'text-black'
          }`}
      >
        {jumuah.name}
      </p>

      <div className="flex gap-1 items-center text-nowrap md:w-24 flex-1 justify-end">
        <p
          className={`md:text-xs text-[10px] font-normal md:leading-4 leading-3 ${isActive ? 'text-white' : 'text-[#71717a]'
            }`}
        >
          Khutbah
        </p>
        <p
          className={`md:text-base text-sm font-bold ${isActive ? 'text-white' : 'text-[#006fee]'} md:leading-6 leading-5`}
        >
          {jumuah.khutbah}
        </p>
      </div>

      <div className="flex gap-1 items-center text-nowrap md:w-24 flex-1 justify-end">
        <p
          className={`md:text-xs text-[10px] font-normal md:leading-4 leading-3 ${isActive ? 'text-white' : 'text-[#71717a]'
            }`}
        >
          Jama&apos;ah
        </p>
        <p
          className={`md:text-base text-sm font-bold ${isActive ? 'text-white' : 'text-[#006fee]'} md:leading-6 leading-5`}
        >
          {jumuah.jamaah}
        </p>
      </div>
    </div>
  );
};
