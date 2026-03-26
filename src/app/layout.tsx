import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
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
        className={`${inter.variable} ${notoSansDevanagari.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
