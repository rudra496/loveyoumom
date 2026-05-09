"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode, setMigrationToast } from "@/lib/store";
import DataManager from "./DataManager";

const links = [
  { href: "/", label: "home", emoji: "🏠" },
  { href: "/timeline", label: "timeline", emoji: "📜" },
  { href: "/recipes", label: "recipes", emoji: "🍲" },
  { href: "/voices", label: "voices", emoji: "🎵" },
  { href: "/wisdom", label: "wisdom", emoji: "💭" },
  { href: "/gallery", label: "gallery", emoji: "📸" },
  { href: "/love-letter", label: "loveLetter", emoji: "💌" },
  { href: "/gratitude", label: "gratitude", emoji: "🙏" },
  { href: "/quiz", label: "quiz", emoji: "🧠" },
  { href: "/family-tree", label: "familyTree", emoji: "🌳" },
  { href: "/promises", label: "promises", emoji: "🤝" },
  { href: "/celebration", label: "celebration", emoji: "🎉" },
  { href: "/bedtime", label: "bedtime", emoji: "🌙" },
  { href: "/card", label: "card", emoji: "💐" },
];

export default function Navbar() {
  const { t, lang, toggle } = useLang();
  const { dark, toggleDark } = useDarkMode();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMigrationToast((msg: string) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
    });
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
    }
  }, [dark]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${dark ? "glass-dark bg-black/40" : "glass bg-white/60"}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-heading text-xl font-bold text-rose">
          🌸 Love You Mom
        </Link>
        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-4 flex-wrap">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`text-xs font-medium transition-colors flex items-center gap-1 px-2 py-1 rounded-lg ${pathname === l.href ? (dark ? "bg-white/10 text-rose" : "bg-rose/10 text-rose") : (dark ? "text-gray-300 hover:text-rose" : "text-gray-700 hover:text-rose")}`}>
              <span>{l.emoji}</span>
              <span>{t(l.label)}</span>
            </Link>
          ))}
          <button onClick={toggleDark} className="px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-semibold hover:bg-gold/40 transition" title="Dark Mode">
            {dark ? "☀️" : "🌙"}
          </button>
          <button onClick={toggle} className="px-3 py-1 rounded-full bg-lavender/20 text-lavender text-sm font-semibold hover:bg-lavender/40 transition">
            {lang === "en" ? "বাংলা" : "English"}
          </button>
          <DataManager />
        </div>
        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={toggleDark} className="px-2 py-1 rounded-full bg-gold/20 text-gold text-sm">
            {dark ? "☀️" : "🌙"}
          </button>
          <button onClick={toggle} className="px-2 py-1 rounded-full bg-lavender/20 text-lavender text-xs font-semibold">
            {lang === "en" ? "বাং" : "EN"}
          </button>
          <DataManager />
          <button onClick={() => setOpen(!open)} className={dark ? "text-white" : "text-gray-700"}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`lg:hidden overflow-hidden ${dark ? "bg-black/90" : "bg-white/90"}`}>
            <div className="px-4 py-2 grid grid-cols-2 gap-1 max-h-[70vh] overflow-y-auto">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`py-2 px-3 text-sm font-medium rounded-lg flex items-center gap-2 ${pathname === l.href ? "bg-rose/10 text-rose" : (dark ? "text-gray-300 hover:text-rose" : "text-gray-700 hover:text-rose")}`}>
                  <span>{l.emoji}</span>
                  <span>{t(l.label)}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Migration toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-bounce">
          {toast}
        </div>
      )}
    </nav>
  );
}
