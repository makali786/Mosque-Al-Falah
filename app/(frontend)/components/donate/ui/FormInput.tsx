import Image from 'next/image';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number';
  placeholder?: string;
  required?: boolean;
  icon?: string;
  iconAlt?: string;
}

export default function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  icon,
  iconAlt = '',
}: FormInputProps) {
  return (
    <div className="flex flex-col h-[70px] items-start min-w-[116px] w-full">
      <div className="flex items-center pb-3 pr-2 w-full">
        <p className="text-xs font-normal leading-4 text-[#52525B]">{label}</p>
        {required && (
          <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
            <p className="text-sm font-normal leading-5 text-[#F31260]">*</p>
          </div>
        )}
      </div>
      <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
        {icon && (
          <div className="overflow-hidden w-5 h-5 relative shrink-0 mr-1">
            <Image
              src={icon}
              alt={iconAlt}
              width={20}
              height={20}
              className="absolute inset-[2%]"
            />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
        />
      </div>
    </div>
  );
}
