import { ReactNode } from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  alignItems?: 'center' | 'start';
}

export default function Checkbox({
  checked,
  onChange,
  label,
  alignItems = 'center',
}: CheckboxProps) {
  return (
    <label
      className={`flex gap-2 items-${alignItems} p-2 cursor-pointer`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-5 h-5 rounded-md border-2 border-[#D4D4D8] text-[#006FEE] focus:ring-2 focus:ring-[#006FEE] cursor-pointer shrink-0"
      />
      <span className="text-base font-normal leading-6 text-[#11181C]">
        {label}
      </span>
    </label>
  );
}
