import "./globals.css";
import type { Metadata } from "next";

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
    <html lang="en" className="box-border antialiased">
      <head>
        <link
          rel="icon"
          href="/favicon.png?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <script
          defer
          data-domain="wiselydesk.com"
          src="https://plausible.io/js/script.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
