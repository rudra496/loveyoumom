"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoupons } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import ShareButton from "@/components/ShareButton";
import DarkStars from "@/components/DarkStars";

const iconOptions = ["🍳", "🤗", "🧹", "🎬", "💆", "🍽️", "🛍️", "❤️", "☕", "📱", "🍰", "🌺", "📖", "🎵", "✨", "💝"];

export default function Coupons() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { items, add, redeem } = useCoupons();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("💝");
  const bookRef = useRef<HTMLDivElement>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    add({ title, description: desc, icon, redeemed: false, dateRedeemed: null });
    setTitle(""); setDesc(""); setIcon("💝"); setShowForm(false);
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🎫</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("couponTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("couponDesc")}</p>
        </motion.div>

        <div className="flex justify-center gap-3 mb-8">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl font-semibold shadow-md">
            + {t("addCoupon")}
          </motion.button>
          <ShareButton cardRef={bookRef} shareText="I made love coupons for my mom! 💝 #LoveYouMom #BuiltWithTRAE" />
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAdd}
              className={`rounded-2xl p-6 mb-8 space-y-4 overflow-hidden ${dark ? "bg-white/5" : "bg-white shadow-lg"}`}>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`}
                placeholder="Coupon title (e.g. Breakfast in Bed)" />
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
                className={`w-full p-3 rounded-xl border focus:outline-none h-20 resize-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`}
                placeholder="Description" />
              <div>
                <p className={`text-sm font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>Icon</p>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((ic) => (
                    <button key={ic} type="button" onClick={() => setIcon(ic)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition ${icon === ic ? "bg-rose/20 ring-2 ring-rose" : dark ? "bg-white/5" : "bg-gray-100"}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2 bg-rose text-white rounded-xl font-semibold">{t("save")}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold">{t("cancel")}</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Coupon Grid */}
        <div ref={bookRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((coupon, i) => (
            <motion.div key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl overflow-hidden card-3d ${coupon.redeemed ? "opacity-60" : ""}`}>
              <div className={`bg-gradient-to-br ${i % 2 === 0 ? "from-rose/10 to-pink-50" : "from-lavender/10 to-purple-50"} ${dark ? "!bg-white/5" : ""} p-6 border-2 border-dashed ${dark ? "border-white/10" : "border-rose/20"}`}>
                {coupon.redeemed && (
                  <div className="ribbon"><span>Redeemed ✓</span></div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`text-4xl ${coupon.redeemed ? "grayscale" : ""}`}>{coupon.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-heading font-bold text-lg ${dark ? "text-white" : "text-gray-800"} ${coupon.redeemed ? "line-through" : ""}`}>
                      {coupon.title}
                    </h3>
                    <p className={`text-sm mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>{coupon.description}</p>
                    {coupon.dateRedeemed && (
                      <p className="text-xs text-rose mt-2">Redeemed: {coupon.dateRedeemed}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-dashed ${dark ? 'border-white/10' : 'border-rose/20'}">
                  <span className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>Love You Mom Coupon</span>
                  <motion.button whileTap={{ scale: 0.9 }}
                    onClick={() => redeem(coupon.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${coupon.redeemed
                      ? "bg-gray-200 text-gray-500"
                      : "bg-rose text-white shadow-md hover:shadow-lg"}`}>
                    {coupon.redeemed ? t("redeemed") : t("redeem")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
