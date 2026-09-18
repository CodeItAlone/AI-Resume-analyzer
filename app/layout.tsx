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
  title: "AI Resume Analyzer — Emuser",
  description: "Manuscript-style resume analysis with marginalia and stamp scoring",
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
