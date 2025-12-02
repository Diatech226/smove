import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  title: "SMOVE Communication | We do the work for you",
  description:
    "SMOVE Communication delivers done-for-you social media, paid campaigns, and bold creative so your brand shines without the busywork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-amber-50 text-slate-900 antialiased`}
      >
        <div className="relative min-h-screen overflow-hidden bg-amber-50">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-8 top-16 h-48 w-48 rounded-full bg-yellow-300/50 blur-3xl" aria-hidden />
            <div className="absolute right-12 top-24 h-56 w-56 rounded-full bg-blue-500/30 blur-3xl" aria-hidden />
            <div className="absolute left-1/4 bottom-16 h-64 w-64 rounded-full bg-yellow-200/40 blur-3xl" aria-hidden />
          </div>
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
