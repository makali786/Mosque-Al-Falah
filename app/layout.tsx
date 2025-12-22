import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "./components/TopBar";
import MainHeader from "./components/MainHeader";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600"],
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
        className={`${inter.variable} font-sans antialiased`}
      >
        <TopBar />
        <MainHeader />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
