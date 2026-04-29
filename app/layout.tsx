import "./globals.css";
import React from "react";

import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0c0c0e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Axiom Freight — Cargo Rate Estimator",
  description: "Instant sea freight rate estimates for LCL shipments on the Guangzhou to Jebel Ali lane.",
  keywords: [
    "sea freight",
    "LCL",
    "cargo rate estimator",
    "Guangzhou to Jebel Ali",
    "freight calculator",
    "shipping costs",
    "logistics",
  ],
  authors: [{ name: "Axiom Freight" }],
  robots: "index, follow",
  openGraph: {
    title: "Axiom Freight — Cargo Rate Estimator",
    description: "Instant sea freight rate estimates for LCL shipments on the Guangzhou to Jebel Ali lane.",
    url: "https://axiom-freight.vercel.app",
    siteName: "Axiom Freight",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axiom Freight — Cargo Rate Estimator",
    description: "Instant sea freight rate estimates for LCL shipments on the Guangzhou to Jebel Ali lane.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
