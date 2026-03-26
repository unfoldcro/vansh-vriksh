import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans_Devanagari, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Vansh Vriksh | वंश वृक्ष | Free Hindu Family Tree",
  description:
    "Build your family tree for free. 38+ Indian relations, Hindi-English bilingual, gotra-based connections. सेवा — 100% free.",
  keywords: [
    "वंश वृक्ष",
    "परिवार वृक्ष",
    "family tree Hindi",
    "gotra",
    "कुल वृक्ष",
    "श्राद्ध",
    "Hindu family tree",
    "free family tree India",
  ],
  metadataBase: new URL("https://vansh-vriksh.unfoldcro.in"),
  openGraph: {
    title: "Vansh Vriksh | वंश वृक्ष",
    description:
      "अपने पूर्वजों की विरासत को डिजिटल करें — Digitize Your Ancestral Legacy. 100% Free Seva.",
    url: "https://vansh-vriksh.unfoldcro.in",
    siteName: "Vansh Vriksh",
    locale: "hi_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body
        className={`${spaceGrotesk.variable} ${notoSansDevanagari.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
