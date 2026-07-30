import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Summit Outdoor | Premium Trail Running Gear",
  description: "A premium outdoor and trail running gear retailer focused on authentic products, expert knowledge, and an active outdoor community.",
  icons: {
    icon: '/icon.svg?v=red',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
