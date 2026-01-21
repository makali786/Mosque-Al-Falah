'use client';

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import "./globals.css";
import TopBar from "./components/layout/TopBar";
import MainHeader from "./components/layout/MainHeader";
import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/layout/WhatsAppButton";
import AccessibilityButton from "./components/layout/AccessibilityButton";
import { LoadingProvider } from "./components/common/LoadingProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
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

  // Fetch prayer times data for TopBar
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prayer times
        const prayerTimesRes = await fetch('/api/prayer-times?limit=10000&sort=date');
        const prayerTimesData = await prayerTimesRes.json();

        // Fetch settings
        const settingsRes = await fetch('/api/globals/prayer-time-settings');
        const settingsData = await settingsRes.json();

        setPrayerTimes(prayerTimesData.docs || []);
        setSettings(settingsData);
      } catch (error) {
        console.error('Failed to fetch prayer times data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <LoadingProvider>
          <TopBar prayerTimes={prayerTimes} settings={settings} />
          <MainHeader />
          <main className="min-h-screen">{children}</main>
          {!hideFooter && <Footer />}
          <WhatsAppButton />
          <AccessibilityButton />
        </LoadingProvider>
      </body>
    </html>
  );
}
