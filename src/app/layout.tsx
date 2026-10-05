import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { portfolio } from "@/data/portfolio";
import "./globals.css";

// The design is set entirely in Inter Regular (400) and Medium (500).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const { profile } = portfolio;

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.about,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.about,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full lg:overflow-hidden">{children}</body>
    </html>
  );
}
