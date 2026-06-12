import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkShelf — Your reading list, decaying in real time.",
  description: "A cross-platform read-later application where saved links decay over time using a dynamic freshness scoring system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark bg-background text-foreground`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
