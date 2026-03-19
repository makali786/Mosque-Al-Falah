'use client';

import { Inter, Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthProvider from './components/common/AuthProvider';
import HashScrollHandler from './components/common/HashScrollHandler';
import { LoadingProvider } from './components/common/LoadingProvider';
import { MediaPlayerProvider } from './components/common/MediaPlayerContext';
import MiniPlayer from './components/common/MiniPlayer';
import PopupManager from './components/common/PopupManager';
import DonationToast from './components/donation/DonationToast';
import GoogleMapsScript from './components/GoogleMapsScript';
import AccessibilityButton from './components/layout/AccessibilityButton';
import Footer from './components/layout/Footer';
import MainHeader from './components/layout/MainHeader';
import NotificationBar from './components/layout/NotificationBar';
import TopBar from './components/layout/TopBar';
import WhatsAppButton from './components/layout/WhatsAppButton';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideFooter = pathname === '/donate';
  const [prayerTimes, setPrayerTimes] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  const [notification, setNotification] = useState<any>(null);

  // Fetch prayer times data for TopBar
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prayer times
        const prayerTimesRes = await fetch(
          '/api/prayer-times?limit=10000&sort=date'
        );
        const prayerTimesData = await prayerTimesRes.json();

        // Fetch settings
        const settingsRes = await fetch('/api/globals/prayer-time-settings');
        const settingsData = await settingsRes.json();

        // Fetch active notification
        const notificationRes = await fetch(
          '/api/notifications?where[isActive][equals]=true&limit=1'
        );
        const notificationData = await notificationRes.json();

        setPrayerTimes(prayerTimesData.docs || []);
        setSettings(settingsData);
        setNotification(notificationData.docs?.[0] || null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  // Scroll management is handled by HashScrollHandler component

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        <GoogleMapsScript />
        <HashScrollHandler />
        <AuthProvider>
          <LoadingProvider>
            <MediaPlayerProvider>
              <TopBar prayerTimes={prayerTimes} settings={settings} />
              <MainHeader />
              <main className="min-h-screen">{children}</main>
              {!hideFooter && <Footer />}
              {notification && <NotificationBar notification={notification} />}
              <DonationToast />
              <WhatsAppButton />
              <AccessibilityButton />
              <MiniPlayer />
              {/* <RamadanCountdown /> */}
              <PopupManager />
            </MediaPlayerProvider>
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
