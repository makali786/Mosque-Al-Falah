'use client';

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
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

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <LoadingProvider>
          <TopBar />
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
