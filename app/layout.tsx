import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Geist_Mono,
  Manrope,
} from "next/font/google";
import "./globals.css";

import FloatingChat from "@/components/FloatingChat";

const bodySans = Manrope({
  variable: "--font-body-sans",
  subsets: ["latin"],
});

const displaySerif = Cormorant_Garamond({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learnial",
  description: "Belajar Lebih Cerdas, Jadwal Lebih Rapi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${bodySans.variable} ${displaySerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        <FloatingChat />
      </body>
    </html>
  );
}
