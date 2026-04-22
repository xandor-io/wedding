import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elexus & Xandor · Save the Date",
  description: "April 25, 2027 · Convento de Santa Clara, Antigua Guatemala",
  openGraph: {
    title: "Elexus & Xandor · Save the Date",
    description: "April 25, 2027 · Antigua, Guatemala",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=Pinyon+Script&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
