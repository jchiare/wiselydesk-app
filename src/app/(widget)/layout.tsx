import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WiselyDesk Chat Widget",
  description: "WiselyDesk chat widget"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="box-border">
      <head>
        <link
          rel="icon"
          href="/favicon.png?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
