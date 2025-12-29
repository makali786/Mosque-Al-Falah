import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "./components/layout/TopBar";
import MainHeader from "./components/layout/MainHeader";
import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/layout/WhatsAppButton";
import AccessibilityButton from "./components/layout/AccessibilityButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Masjid Al-Falah - Islamic Center & Community",
  description: "Welcome to Masjid Al-Falah - A place of worship, community, and spiritual growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <TopBar />
        <MainHeader />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
        <AccessibilityButton />
      </body>
    </html>
  );
}
