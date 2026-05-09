"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ParticleCanvas from "@/components/ParticleCanvas";
import Heart3D from "@/components/Heart3D";
import DarkStars from "@/components/DarkStars";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";

const allFeatures = [
  { emoji: "📜", titleKey: "timeline", desc: "Chronicle her journey through time", href: "/timeline", gradient: "from-rose/10 to-pink-50", cat: "Memories" },
  { emoji: "📸", titleKey: "gallery", desc: "A visual journey through memories", href: "/gallery", gradient: "from-rose/10 to-rose-light/20", cat: "Memories" },
  { emoji: "🎵", titleKey: "voices", desc: "Keep her voice alive forever", href: "/voices", gradient: "from-lavender/10 to-purple-50", cat: "Memories" },
  { emoji: "💭", titleKey: "wisdom", desc: "Her words of wisdom, remembered", href: "/wisdom", gradient: "from-lavender/10 to-blue-50", cat: "Memories" },
  { emoji: "💐", titleKey: "card", desc: "Create beautiful cards for her", href: "/card", gradient: "from-pink-50 to-rose-light/20", cat: "Create" },
  { emoji: "🖼️", titleKey: "collage", desc: "Make stunning photo collages", href: "/collage", gradient: "from-gold/10 to-amber-50", cat: "Create", isNew: true },
  { emoji: "💌", titleKey: "loveLetter", desc: "Pour your heart into words", href: "/love-letter", gradient: "from-pink-50 to-rose-light/20", cat: "Create" },
  { emoji: "🎫", titleKey: "coupons", desc: "Redeemable love coupons", href: "/coupons", gradient: "from-rose/10 to-pink-50", cat: "Create", isNew: true },
  { emoji: "🧠", titleKey: "quiz", desc: "How well do you know her?", href: "/quiz", gradient: "from-purple-50 to-lavender/10", cat: "Fun" },
  { emoji: "📸", titleKey: "photoBooth", desc: "Fun photos with Mom", href: "/photo-booth", gradient: "from-cyan-50 to-blue-50", cat: "Fun", isNew: true },
  { emoji: "🎁", titleKey: "giftBox", desc: "Digital surprise gift box", href: "/gift-box", gradient: "from-red-50 to-rose-50", cat: "Fun", isNew: true },
  { emoji: "🫙", titleKey: "memoryJar", desc: "Fill a jar with love notes", href: "/memory-jar", gradient: "from-amber-50 to-yellow-50", cat: "Fun", isNew: true },
  { emoji: "🍲", titleKey: "recipes", desc: "Preserve her secret recipes", href: "/recipes", gradient: "from-gold/10 to-amber-50", cat: "More" },
  { emoji: "🙏", titleKey: "gratitude", desc: "Daily gratitude for her love", href: "/gratitude", gradient: "from-amber-50 to-gold/10", cat: "More" },
  { emoji: "🌳", titleKey: "familyTree", desc: "Map your family's love story", href: "/family-tree", gradient: "from-green-50 to-emerald-50", cat: "More" },
  { emoji: "🤝", titleKey: "promises", desc: "Make & keep promises to her", href: "/promises", gradient: "from-rose-light/20 to-pink-50", cat: "More" },
  { emoji: "🎉", titleKey: "celebration", desc: "Countdown to special days", href: "/celebration", gradient: "from-gold/10 to-amber-50", cat: "More" },
  { emoji: "🎯", titleKey: "bucketList", desc: "Things to do together", href: "/bucket-list", gradient: "from-indigo-50 to-purple-50", cat: "More", isNew: true },
  { emoji: "🌙", titleKey: "bedtime", desc: "Lullabies under the stars", href: "/bedtime", gradient: "from-indigo-50 to-purple-50", cat: "More" },
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
  { text: "The photo booth was so much fun! We laughed for hours taking silly photos together.", author: "David L." },
  { text: "The memory jar is my favorite — pulling out a random love note every morning.", author: "Priya S." },
];

export default function Home() {
  const { t } = useLang();
  const { dark } = useDarkMode();

  const categories = ["Memories", "Create", "Fun", "More"];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleCanvas />
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
          {/* 3D Heart */}
          <Heart3D />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-heading font-bold mb-4"
          >
            <span className="gradient-text">Love You Mom</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-lg md:text-xl max-w-xl mx-auto mb-2 ${dark ? "text-gray-300" : "text-gray-600"}`}
          >
            {t("subtitle")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-sm italic mb-8 ${dark ? "text-gray-500" : "text-gray-400"}`}
          >
            {t("heroTagline")}
          </motion.p>
          <Link href="/timeline">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-rose to-pink-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow text-lg glow-pulse"
            >
              {t("cta")} ✨
            </motion.button>
          </Link>

          {/* TRAE badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${dark ? "bg-white/5 text-gray-400 border border-white/10" : "bg-white/80 text-gray-500 shadow-sm"}`}>
              <span className="text-base">⚡</span> {t("builtWithTRAE")}
            </span>
          </motion.div>
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
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <h2 className={`text-3xl md:text-4xl font-heading font-bold text-center mb-4 ${dark ? "text-white" : "text-gray-800"}`}>
          🌸 {t("features")}
        </h2>
        <p className={`text-center mb-12 ${dark ? "text-gray-400" : "text-gray-500"}`}>Everything to celebrate the woman who gave you everything</p>

        {categories.map((cat) => (
          <div key={cat} className="mb-12">
            <h3 className={`text-lg font-heading font-semibold mb-4 ${dark ? "text-gray-300" : "text-gray-600"}`}>
              {cat === "Memories" ? "📸" : cat === "Create" ? "🎨" : cat === "Fun" ? "🎮" : "📂"} {cat}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {allFeatures.filter((f) => f.cat === cat).map((f, i) => (
                <motion.div
                  key={f.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={f.href} className={`relative block rounded-2xl p-5 hover:scale-105 transition-all text-center h-full card-3d ${dark ? "bg-white/5 hover:bg-white/10 border border-white/5" : `${f.gradient} hover:shadow-lg border border-white/50`}`}>
                    <div className="text-3xl mb-2">{f.emoji}</div>
                    <h4 className={`font-heading font-semibold text-sm ${dark ? "text-white" : "text-gray-800"}`}>{t(f.titleKey)}</h4>
                    <p className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-500"}`}>{f.desc}</p>
                    {"isNew" in f && f.isNew && (
                      <span className="absolute top-2 right-2 text-[8px] bg-rose text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className={`relative z-10 py-20 px-4 ${dark ? "bg-white/3" : "bg-gradient-to-r from-lavender/5 to-rose/5"}`}>
        <h2 className={`text-3xl font-heading font-bold text-center mb-12 ${dark ? "text-white" : "text-gray-800"}`}>
          💬 {t("testimonialsTitle")}
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {testimonials.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-5 ${dark ? "bg-white/5 border border-white/5" : "bg-white shadow-lg"}`}
            >
              <p className={`text-sm italic mb-3 ${dark ? "text-gray-300" : "text-gray-600"}`}>&ldquo;{q.text}&rdquo;</p>
              <p className={`text-sm font-semibold ${dark ? "text-rose-light" : "text-rose"}`}>— {q.author}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 py-8 text-center ${dark ? "text-gray-600" : "text-gray-400"}`}>
        <p className="text-sm">Made with ❤️ for mothers everywhere</p>
        <p className="text-xs mt-1">Love You Mom © 2026 — {t("builtWithTRAE")}</p>
      </footer>
    </div>
  );
}
