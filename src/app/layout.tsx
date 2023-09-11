import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "WiselyDesk App",
  description: "View your WiselyDesk bot configuration and conversations"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="box-border h-full w-full antialiased">
      <head>
        <link
          rel="icon"
          href="/favicon.png?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>

      <body className="h-full w-full">{children}</body>
      <Analytics />
    </html>
  );
}
