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
  openGraph: {
    title: "LinkShelf — Your reading list, decaying in real time.",
    description: "A cross-platform read-later application where saved links decay over time using a dynamic freshness scoring system.",
    url: "https://linkshelf.app",
    siteName: "LinkShelf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkShelf — Your reading list, decaying in real time.",
    description: "A cross-platform read-later application where saved links decay over time.",
  },
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
      <body className="min-h-full flex flex-col">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-text-primary focus:border focus:border-border"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
