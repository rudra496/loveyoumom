"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePromises } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import Confetti from "@/components/Confetti";
import DarkStars from "@/components/DarkStars";

const presetPromises = [
  "I'll call you every single day ☎️",
  "I'll cook your favorite meal for you 🍳",
  "I'll never forget your lessons 📚",
  "I'll take care of my health — for you 💪",
  "I'll visit more often 🏠",
  "I'll always say I love you ❤️",
  "I'll make you proud every day 🌟",
  "I'll keep the family together 👨‍👩‍👧‍👦",
];

export default function Promises() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { items, add, toggle, remove } = usePromises();
  const { fire: fireConfetti } = Confetti();
  const [customText, setCustomText] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const kept = items.filter((p) => p.kept).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((kept / total) * 100) : 0;

  const handleToggle = (id: string) => {
    const item = items.find((p) => p.id === id);
    if (item && !item.kept) fireConfetti();
    toggle(id);
  };

  const addPreset = (text: string) => {
    if (items.some((p) => p.text === text)) return;
    add({ text, kept: false, dateCreated: new Date().toISOString().split("T")[0], dateKept: null });
  };

  const addCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    add({ text: customText, kept: false, dateCreated: new Date().toISOString().split("T")[0], dateKept: null });
    setCustomText("");
    setShowCustom(false);
  };

  const gradients = ["from-rose/10 to-pink-50", "from-lavender/10 to-purple-50", "from-gold/10 to-amber-50", "from-green-50 to-emerald-50", "from-pink-50 to-rose-light/20"];

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🤝</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("promisesTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("promisesDesc")}</p>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`rounded-2xl p-6 mb-8 ${dark ? "bg-white/5 border border-white/10" : "bg-white shadow-md"}`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`text-sm font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>{kept} / {total} {t("keptPromises")}</span>
            <span className={`text-sm font-bold ${dark ? "text-gold" : "text-gold"}`}>{pct}%</span>
          </div>
          <div className={`w-full h-3 rounded-full ${dark ? "bg-white/10" : "bg-gray-100"}`}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-3 rounded-full bg-gradient-to-r from-rose via-lavender to-gold" />
          </div>
        </motion.div>

        {/* Preset promises */}
        <div className={`rounded-2xl p-4 mb-6 ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
          <p className={`text-sm font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}>Quick Add</p>
          <div className="flex flex-wrap gap-2">
            {presetPromises.filter((p) => !items.some((i) => i.text === p)).map((p) => (
              <button key={p} onClick={() => addPreset(p)} className={`px-3 py-2 rounded-full text-xs transition ${dark ? "bg-white/10 text-gray-300 hover:bg-white/20" : "bg-rose/10 text-rose hover:bg-rose/20"}`}>
                + {p}
              </button>
            ))}
          </div>
        </div>

        {/* Custom promise */}
        <div className="mb-6">
          {!showCustom ? (
            <button onClick={() => setShowCustom(true)} className={`text-sm font-medium ${dark ? "text-rose-light" : "text-rose"}`}>+ {t("addPromise")} ({t("custom")})</button>
          ) : (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} onSubmit={addCustom} className={`rounded-2xl p-4 space-y-3 ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
              <input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`} placeholder="Your promise..." required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-rose text-white rounded-xl font-semibold text-sm">{t("save")}</button>
                <button type="button" onClick={() => setShowCustom(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm">{t("cancel")}</button>
              </div>
            </motion.form>
          )}
        </div>

        {/* Promise cards */}
        <div className="space-y-4">
          {items.length === 0 && <p className={`text-center py-8 ${dark ? "text-gray-600" : "text-gray-400"}`}>No promises yet. Make your first promise!</p>}
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-5 flex items-center gap-4 transition-all ${item.kept
                ? (dark ? "bg-green-500/10 border border-green-500/20" : "bg-green-50 border border-green-200")
                : (dark ? `bg-white/5 border border-white/10` : `bg-gradient-to-r ${gradients[i % gradients.length]} shadow-sm`)
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => handleToggle(item.id)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.kept ? "bg-green-500 border-green-500 text-white" : (dark ? "border-white/30 text-transparent" : "border-rose/30 text-transparent")}`}
              >
                {item.kept && "✓"}
              </motion.button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${item.kept ? "line-through text-gray-400" : (dark ? "text-gray-200" : "text-gray-700")}`}>{item.text}</p>
                <p className="text-xs text-gray-400 mt-1">{item.dateCreated}</p>
              </div>
              {item.kept && <span className="text-green-500 text-lg">🎉</span>}
              <button onClick={() => remove(item.id)} className="text-xs text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
