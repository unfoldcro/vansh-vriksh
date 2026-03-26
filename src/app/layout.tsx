import type { Metadata } from "next";
import { DM_Sans, Poppins, Noto_Sans_Devanagari } from "next/font/google";
import { TranslationProvider } from "@/contexts/TranslationContext";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
    <html lang="hi" className="notranslate" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${dmSans.variable} ${poppins.variable} ${notoSansDevanagari.variable} font-body antialiased`}
      >
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
