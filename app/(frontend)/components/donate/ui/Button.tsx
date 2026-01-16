import { ReactNode } from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'disabled';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export default function Button({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseClasses =
    'flex h-10 sm:h-12 items-center justify-center px-4 sm:px-6 rounded-xl cursor-pointer transition-colors';

  const variantClasses = {
    primary:
      'bg-[#006FEE] text-white hover:bg-[#0055CC] disabled:opacity-50 disabled:cursor-not-allowed',
    outline:
      'border-2 border-[#006FEE] border-solid text-[#006FEE] hover:bg-[#006FEE]/5',
    disabled: 'bg-[rgba(63,63,70,0.4)] text-white cursor-not-allowed',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <span className="text-sm sm:text-base font-normal leading-tight sm:leading-6">{children}</span>
    </button>
  );
}
