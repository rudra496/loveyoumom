import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/lib/LanguageContext";
import { DarkModeProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Maa Ki Kahani — Your Mother's Story, Beautifully Preserved",
  description: "An interactive digital memory book for Mother's Day",
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
          </LanguageProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
