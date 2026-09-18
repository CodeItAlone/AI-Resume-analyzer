import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "600", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "EMUSER — AI Resume & Job Fit Analyzer",
  description: "Evidence-backed manuscript resume analysis with deterministic scoring, requirement matching, and factual feedback.",
  icons: {
    icon: [
      { url: '/emuser-icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/emuser-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/emuser-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "EMUSER — AI Resume & Job Fit Analyzer",
    description: "Edit • Analyze • Advance — Objective, evidence-backed candidate evaluation.",
    images: [{ url: '/emuser-logo.png', width: 1024, height: 1024, alt: 'EMUSER' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F5F0] text-[#1C1B19] font-serif">
        {children}
      </body>
    </html>
  );
}
