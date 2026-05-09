import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/lib/LanguageContext";
import { DarkModeProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Love You Mom — Your Mother's Story, Beautifully Preserved",
  description: "An interactive digital memory book for Mother's Day. Create cards, collages, photo booths, love letters, and more!",
  keywords: ["mothers day", "gift", "digital", "memory", "love", "card", "collage"],
  openGraph: {
    title: "Love You Mom — Your Mother's Story, Beautifully Preserved",
    description: "Create beautiful digital gifts for your mom — cards, collages, love letters, and more!",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@400;600;700&family=Satisfy&family=Pacifico&family=Great+Vibes&display=swap" rel="stylesheet" />
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
