import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const SITE_URL = "https://birsethomasdesign.com";

export const metadata: Metadata = {
  title: "Birse Thomas Design",
  description:
    "Birse Thomas Design is an architecture and interior design studio creating considered spaces that balance form, function, and feeling.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Birse Thomas Design",
    description:
      "Architecture and interior design studio creating considered spaces that balance form, function, and feeling.",
    url: SITE_URL,
    siteName: "Birse Thomas Design",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birse Thomas Design",
    description:
      "Architecture and interior design studio creating considered spaces.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
