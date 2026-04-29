export const metadata = {
  title: "Axiom Freight — Cargo Rate Estimator",
  description: "Instant sea freight rate estimates for LCL shipments on the Guangzhou to Jebel Ali lane.",
};

import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}

