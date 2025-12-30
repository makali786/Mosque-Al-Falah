import Image from 'next/image';
import logo from '../../../../public/assets/header/logo.svg';

export default function Logo() {
  return (
    <Image
      style={{ backgroundColor: '#2f45a7ff', padding: 20, borderRadius: 20 }}
      src={logo}
      alt="Logo"
      width={200}
      height={200}
    />
  );
}
