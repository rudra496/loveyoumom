import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/lib/LanguageContext";
import { DarkModeProvider } from "@/lib/store";

const SITE_URL = "https://rudra496.github.io/loveyoumom";
const SITE_NAME = "Love You Mom";
const SITE_TITLE = "Love You Mom — Interactive Digital Memory Book | Mother's Day Tribute";
const SITE_DESCRIPTION =
  "Love You Mom — Create and share beautiful digital memory books for Mother's Day. Interactive tribute app with animations and personal messages.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "mothers day",
    "tribute",
    "memory book",
    "digital",
    "interactive",
    "love",
    "gift",
    "card",
    "collage",
    "Mother's Day gift",
    "digital memory book",
    "interactive tribute",
    "personal messages",
    "animations",
  ],
  authors: [{ name: "Rudra Sarker", url: "https://rudra496.github.io/site" }],
  creator: "Rudra Sarker",
  publisher: "Rudra Sarker",
  category: "Lifestyle",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@rudra496",
    site: "@rudra496",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#softwareapp`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Person",
        "@id": `${SITE_URL}/#author`,
        name: "Rudra Sarker",
        url: "https://rudra496.github.io/site",
        sameAs: [
          "https://github.com/rudra496",
          "https://www.linkedin.com/in/rudrasarker",
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@400;600;700&family=Satisfy&family=Pacifico&family=Great+Vibes&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-cream transition-colors duration-500">
        <DarkModeProvider>
          <LanguageProvider>
            <Navbar />
            {children}
            <footer className="text-center py-8 px-4 text-sm text-gray-400 border-t border-gray-200/50">
              <p>Built with ❤️ by <a href="https://github.com/rudra496" target="_blank" className="text-rose hover:underline font-medium">Rudra Sarker</a></p>
              <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
                <a href="https://rudra496.github.io/site" target="_blank" className="hover:text-rose transition">🌐 Portfolio</a>
                <a href="https://github.com/rudra496" target="_blank" className="hover:text-rose transition">💻 GitHub</a>
                <a href="https://www.linkedin.com/in/rudrasarker" target="_blank" className="hover:text-rose transition">💼 LinkedIn</a>
                <a href="https://x.com/Rudra496" target="_blank" className="hover:text-rose transition">🐦 Twitter/X</a>
                <a href="https://devpost.com/rudrasarker" target="_blank" className="hover:text-rose transition">🚀 DevPost</a>
                <a href="https://www.youtube.com/@rudrasarker9732" target="_blank" className="hover:text-rose transition">📺 YouTube</a>
              </div>
              <p className="mt-2">Happy Mother&apos;s Day 💐</p>
              <p className="mt-1 text-xs">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose/10 text-rose font-medium">
                  ⚡ Built with TRAE IDE
                </span>
              </p>
            </footer>
          </LanguageProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
