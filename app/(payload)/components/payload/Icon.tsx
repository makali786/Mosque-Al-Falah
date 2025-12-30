import Image from 'next/image';
import logo from '../../../../public/assets/header/icon.png';

export default function Icon() {
  return (
    <Image
      src={logo}
      alt="Logo"
      width={100}
      height={100}
      style={{ scale: 1.5 }}
    />
  );
}
