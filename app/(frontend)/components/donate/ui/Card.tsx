import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'default' | 'large' | 'none';
}

export default function Card({
  children,
  className = '',
  padding = 'default',
}: CardProps) {
  const paddingClasses = {
    default: 'p-6',
    large: 'p-8',
    none: '',
  };

  return (
    <div
      className={`bg-[#FAFAFA] rounded-xl ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
