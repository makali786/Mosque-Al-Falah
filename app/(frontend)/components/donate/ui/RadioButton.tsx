import Image from 'next/image';

interface RadioButtonProps {
  name: string;
  checked: boolean;
  onChange: () => void;
}

export default function RadioButton({
  name,
  checked,
  onChange,
}: RadioButtonProps) {
  return (
    <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className={`appearance-none col-1 row-1 ml-0 mt-0 w-5 h-5 rounded-full border-2 cursor-pointer ${
          checked ? 'bg-[#006FEE] border-[#006FEE]' : 'bg-white border-[#D4D4D8]'
        }`}
      />
      {checked && (
        <div className="col-1 row-1 w-[6.22px] h-[4.44px] ml-[7px] mt-[8px] relative pointer-events-none">
          <Image
            src="/assets/donation/checkmark-icon.svg"
            alt="Check"
            width={7}
            height={5}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
