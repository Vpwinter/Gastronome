import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gastronome - Recipe Manager",
  description: "Your personal recipe, books, and courses manager",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
      {
        url: '/favicon-16.svg',
        type: 'image/svg+xml',
        sizes: '16x16',
      },
      {
        url: '/favicon32.svg',
        type: 'image/svg+xml',
        sizes: '32x32',
      }
    ],
    shortcut: '/favicon.svg',
    apple: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: '180x180',
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-background text-foreground`}
      >
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
