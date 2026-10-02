import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: "%s | স্মার্ট শপ বাংলাদেশ",
    default: "স্মার্ট শপ বাংলাদেশ — বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম",
  },
  description: "প্রিমিয়াম কোয়ালিটি ফ্যাশন, ইলেকট্রনিক্স, কিডস ও লাইফস্টাইল পণ্য দ্রুততম হোম ডেলিভারি ও ক্যাশ অন ডেলিভারিতে কিনুন।",
  keywords: ["online shopping bangladesh", "e-commerce bd", "অনলাইন শপিং", "বাংলাদেশ অনলাইন শপ", "স্মার্ট শপ"],
  authors: [{ name: "Aulad IT Solution", url: "https://auladit.com" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "স্মার্ট শপ বাংলাদেশ — বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম",
    description: "প্রিমিয়াম কোয়ালিটি পণ্য দ্রুততম ডেলিভারি ও নিশ্চিত কোয়ালিটিতে।",
    locale: "bn_BD",
    type: "website",
  },
};

import { StoreSettingsProvider } from "@/context/StoreSettingsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        <StoreSettingsProvider>
          {children}
        </StoreSettingsProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
