"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGiftBox } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import Confetti from "@/components/Confetti";
import DarkStars from "@/components/DarkStars";

const themes = [
  { name: "Classic Red", bg: "from-red-500 to-rose-600", ribbon: "bg-gold" },
  { name: "Royal Purple", bg: "from-purple-500 to-indigo-600", ribbon: "bg-yellow-300" },
  { name: "Rose Gold", bg: "from-rose-400 to-pink-500", ribbon: "bg-white" },
  { name: "Emerald", bg: "from-emerald-500 to-teal-600", ribbon: "bg-gold" },
];

export default function GiftBox() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { items, add } = useGiftBox();
  const confetti = Confetti();
  const [theme, setTheme] = useState(themes[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [giftType, setGiftType] = useState<"text" | "photo" | "coupon">("text");
  const [content, setContent] = useState("");
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (items.length === 0) return;
    setOpening(true);
    setTimeout(() => {
      setIsOpen(true);
      confetti.fire();
      setOpening(false);
    }, 800);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    add({ type: giftType, content, opened: false });
    setContent(""); setShowForm(false);
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🎁</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("giftBoxTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("giftBoxDesc")}</p>
        </motion.div>

        {/* Theme Picker */}
        <div className="flex gap-3 justify-center mb-8">
          {themes.map((th) => (
            <button key={th.name} onClick={() => setTheme(th)} title={th.name}
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${th.bg} ${theme.name === th.name ? "ring-2 ring-offset-2 ring-rose scale-110" : ""} transition-transform`} />
          ))}
        </div>

        {/* Gift Box Visual */}
        <div className="flex justify-center mb-8">
          <div className="relative" style={{ perspective: "800px" }}>
            {/* Lid */}
            <motion.div
              className={`relative w-56 h-16 bg-gradient-to-br ${theme.bg} rounded-t-2xl ${theme.ribbon} before:absolute before:inset-x-0 before:top-1/2 before:h-3 before:${theme.ribbon} z-10`}
              animate={opening ? { rotateX: -120, y: -40 } : isOpen ? { rotateX: -120, y: -40 } : {}}
              transition={{ duration: 0.8 }}
              style={{ transformOrigin: "top" }}
            >
              <div className={`absolute inset-x-1/3 top-0 bottom-0 ${theme.ribbon} rounded`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🎀</span>
              </div>
            </motion.div>

            {/* Box body */}
            <motion.div
              className={`relative w-56 h-48 bg-gradient-to-br ${theme.bg} rounded-b-2xl flex items-center justify-center cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              onClick={items.length > 0 && !isOpen ? handleOpen : undefined}
              animate={opening ? { scale: [1, 1.05, 1] } : {}}
            >
              {items.length === 0 ? (
                <p className="text-white/70 text-sm text-center px-4">Add gifts to fill the box!</p>
              ) : isOpen ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 max-h-40 overflow-y-auto px-4">
                  {items.map((gift, i) => (
                    <div key={gift.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white text-sm">
                      <span className="text-lg mr-2">{gift.type === "text" ? "💌" : gift.type === "photo" ? "📸" : "🎫"}</span>
                      {gift.content}
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center text-white/80">
                  <p className="text-4xl mb-2">🎁</p>
                  <p className="text-sm font-semibold">{items.length} gift{items.length !== 1 ? "s" : ""} inside!</p>
                  <p className="text-xs mt-1 opacity-70">Click to open</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center mb-8">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl font-semibold shadow-md">
            + {t("addGift")}
          </motion.button>
          {isOpen && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setIsOpen(false)}
              className={`px-6 py-3 rounded-xl font-semibold ${dark ? "bg-white/10 text-white" : "bg-white shadow text-gray-700"}`}>
              Close Box
            </motion.button>
          )}
        </div>

        {/* Add Gift Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAdd}
              className={`rounded-2xl p-6 space-y-4 overflow-hidden ${dark ? "bg-white/5" : "bg-white shadow-lg"}`}>
              <div className="flex gap-2">
                {([["text", "💌", "textGift"], ["photo", "📸", "photoGift"], ["coupon", "🎫", "couponGift"]] as const).map(([type, emoji, key]) => (
                  <button key={type} type="button" onClick={() => setGiftType(type)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${giftType === type ? "bg-rose text-white" : dark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                    {emoji} {t(key)}
                  </button>
                ))}
              </div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required
                className={`w-full p-3 rounded-xl border focus:outline-none h-24 resize-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`}
                placeholder={giftType === "text" ? "Write a love message..." : giftType === "photo" ? "Describe a photo memory..." : "Coupon title..."} />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2 bg-rose text-white rounded-xl font-semibold">{t("save")}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold">{t("cancel")}</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
