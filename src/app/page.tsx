"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import FlowerPetals from "@/components/FlowerPetals";
import DarkStars from "@/components/DarkStars";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";

const allFeatures = [
  { emoji: "📸", titleKey: "timeline", desc: "Chronicle her journey through time", href: "/timeline", gradient: "from-rose/10 to-pink-50" },
  { emoji: "🍲", titleKey: "recipes", desc: "Preserve her secret recipes", href: "/recipes", gradient: "from-gold/10 to-amber-50" },
  { emoji: "🎵", titleKey: "voices", desc: "Keep her voice alive forever", href: "/voices", gradient: "from-lavender/10 to-purple-50" },
  { emoji: "💭", titleKey: "wisdom", desc: "Her words of wisdom, remembered", href: "/wisdom", gradient: "from-lavender/10 to-blue-50" },
  { emoji: "📸", titleKey: "gallery", desc: "A visual journey through memories", href: "/gallery", gradient: "from-rose/10 to-rose-light/20" },
  { emoji: "💌", titleKey: "loveLetter", desc: "Pour your heart into words", href: "/love-letter", gradient: "from-pink-50 to-rose-light/20" },
  { emoji: "🙏", titleKey: "gratitude", desc: "Daily gratitude for her love", href: "/gratitude", gradient: "from-amber-50 to-gold/10" },
  { emoji: "🧠", titleKey: "quiz", desc: "How well do you know her?", href: "/quiz", gradient: "from-purple-50 to-lavender/10" },
  { emoji: "🌳", titleKey: "familyTree", desc: "Map your family's love story", href: "/family-tree", gradient: "from-green-50 to-emerald-50" },
  { emoji: "🤝", titleKey: "promises", desc: "Make & keep promises to her", href: "/promises", gradient: "from-rose-light/20 to-pink-50" },
  { emoji: "🎉", titleKey: "celebration", desc: "Countdown to special days", href: "/celebration", gradient: "from-gold/10 to-amber-50" },
  { emoji: "🌙", titleKey: "bedtime", desc: "Lullabies under the stars", href: "/bedtime", gradient: "from-indigo-50 to-purple-50" },
  { emoji: "💐", titleKey: "card", desc: "Create beautiful cards", href: "/card", gradient: "from-pink-50 to-rose-light/20" },
];

const reasons = [
  "Your warm hugs that fix everything 💕",
  "The way you make any house feel like home 🏡",
  "Your endless patience and unconditional love 🌟",
  "The meals that taste like heaven 🍽️",
  "Your laughter that lights up every room ✨",
  "The sacrifices you made without a word 🤫",
  "Your wisdom that guides me always 🧭",
  "For being my first teacher and best friend 👩‍🏫",
  "Your strength that inspires me daily 💪",
  "The way you believe in me even when I don't 🙏",
];

const testimonials = [
  { text: "I finally have a place to preserve all of mom's recipes and stories. This is beautiful.", author: "Sarah K." },
  { text: "Made my mom cry happy tears with the love letter feature. Best gift ever!", author: "Rahul M." },
  { text: "The family tree feature helped us reconnect with our roots. Truly special.", author: "Amina T." },
];

export default function Home() {
  const { t } = useLang();
  const { dark } = useDarkMode();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FlowerPetals />
      <DarkStars />
      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className={`absolute inset-0 ${dark ? "bg-gradient-to-br from-[#0f0d1a] via-[#1a1030] to-[#0f0d1a]" : "bg-gradient-to-br from-cream via-pink-50 to-lavender-light/30"}`} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-7xl mb-4 heart-pulse inline-block"
          >
            ❤️
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold bg-gradient-to-r from-rose via-lavender to-gold bg-clip-text text-transparent mb-4">
            Maa Ki Kahani
          </h1>
          <p className={`text-lg md:text-xl max-w-xl mx-auto mb-2 ${dark ? "text-gray-300" : "text-gray-600"}`}>
            {t("subtitle")}
          </p>
          <p className={`text-sm italic mb-8 ${dark ? "text-gray-500" : "text-gray-400"}`}>
            {t("heroTagline")}
          </p>
          <Link href="/timeline">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-rose to-pink-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow text-lg"
            >
              {t("cta")} ✨
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Marquee */}
      <section className={`relative z-10 py-4 overflow-hidden ${dark ? "bg-rose/10" : "bg-rose/5"}`}>
        <div className="flex whitespace-nowrap marquee-track">
          {[...reasons, ...reasons].map((r, i) => (
            <span key={i} className={`mx-8 text-sm font-medium ${dark ? "text-rose-light" : "text-rose"}`}>{r}</span>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-4 max-w-6xl mx-auto">
        <h2 className={`text-3xl md:text-4xl font-heading font-bold text-center mb-4 ${dark ? "text-white" : "text-gray-800"}`}>
          🌸 {t("features")}
        </h2>
        <p className={`text-center mb-12 ${dark ? "text-gray-400" : "text-gray-500"}`}>Everything to celebrate the woman who gave you everything</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={f.href} className={`block rounded-2xl p-5 hover:scale-105 transition-all text-center h-full ${dark ? "bg-white/5 hover:bg-white/10 border border-white/5" : `${f.gradient} hover:shadow-lg border border-white/50`}`}>
                <div className="text-3xl mb-2">{f.emoji}</div>
                <h3 className={`font-heading font-semibold text-sm ${dark ? "text-white" : "text-gray-800"}`}>{t(f.titleKey)}</h3>
                <p className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-500"}`}>{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={`relative z-10 py-20 px-4 ${dark ? "bg-white/3" : "bg-gradient-to-r from-lavender/5 to-rose/5"}`}>
        <h2 className={`text-3xl font-heading font-bold text-center mb-12 ${dark ? "text-white" : "text-gray-800"}`}>
          💬 {t("testimonialsTitle")}
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-6 ${dark ? "bg-white/5 border border-white/5" : "bg-white shadow-lg"}`}
            >
              <p className={`text-sm italic mb-4 ${dark ? "text-gray-300" : "text-gray-600"}`}>&ldquo;{q.text}&rdquo;</p>
              <p className={`text-sm font-semibold ${dark ? "text-rose-light" : "text-rose"}`}>— {q.author}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 py-8 text-center ${dark ? "text-gray-600" : "text-gray-400"}`}>
        <p className="text-sm">Made with ❤️ for mothers everywhere</p>
        <p className="text-xs mt-1">Maa Ki Kahani © 2026</p>
      </footer>
    </div>
  );
}
