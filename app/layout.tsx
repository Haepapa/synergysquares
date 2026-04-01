import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Synergy Squares",
    template: "%s | Synergy Squares",
  },
  description:
    "Create, customize, and play bingo games individually or with others.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Synergy Squares",
    title: "Synergy Squares — Multiplayer Bingo Generator",
    description:
      "Create, customize, and play bingo games individually or with others.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Synergy Squares — Multiplayer Bingo Generator",
    description:
      "Create, customize, and play bingo games individually or with others.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" richColors closeButton expand={true} />
      </body>
    </html>
  );
}
