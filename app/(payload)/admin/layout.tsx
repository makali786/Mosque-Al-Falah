import { Metadata } from 'next';
import AdminLayout from '../components/AdminLayout';

export const metadata: Metadata = {
    title: 'Masjid Al-Falah Admin',
    description: 'Admin panel for Masjid Al-Falah',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
}
