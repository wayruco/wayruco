import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wayru - Eternal Voyage",
  description:
    "The mission continues. Bridging the digital divide through open-source permanence.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Mobile web app configuration */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Wayru" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0a0e1a" />
        
        {/* Disable tap highlight on mobile */}
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Prevent automatic phone number detection */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
