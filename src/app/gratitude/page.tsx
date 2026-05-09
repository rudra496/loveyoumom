"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useGratitude } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import DarkStars from "@/components/DarkStars";

const moods = ["❤️ Love", "😊 Happy", "😢 Nostalgic", "🌸 Peaceful", "🙏 Grateful", "🎉 Joyful"];

export default function Gratitude() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { items, add, remove } = useGratitude();
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(moods[0]);
  const [showMonthly, setShowMonthly] = useState(false);

  const streak = useMemo(() => {
    if (items.length === 0) return 0;
    const dates = [...new Set(items.map((i) => i.date))].sort().reverse();
    let count = 0;
    const today = new Date();
    for (let d = 0; d < 365; d++) {
      const check = new Date(today);
      check.setDate(check.getDate() - d);
      const ds = check.toISOString().split("T")[0];
      if (dates.includes(ds)) count++;
      else if (d === 0) continue; // today might not have entry yet
      else break;
    }
    return count;
  }, [items]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return items.filter((i) => i.date.startsWith(monthKey));
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    add({ date: new Date().toISOString().split("T")[0], content, mood });
    setContent("");
  };

  const gradients = ["from-rose/10 to-pink-50", "from-lavender/10 to-purple-50", "from-gold/10 to-amber-50", "from-green-50 to-emerald-50", "from-blue-50 to-indigo-50"];

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🙏</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("gratitudeTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("gratitudeDesc")}</p>
        </motion.div>

        {/* Streak */}
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`rounded-2xl p-6 mb-8 text-center ${dark ? "bg-gradient-to-r from-gold/10 to-rose/10 border border-gold/20" : "bg-gradient-to-r from-gold/10 to-rose/10"}`}>
          <div className="text-4xl mb-2">🔥</div>
          <div className={`text-3xl font-heading font-bold ${dark ? "text-gold" : "text-gold"}`}>{streak}</div>
          <div className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{t("streak")}</div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={`rounded-2xl p-6 mb-8 ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
          <p className={`text-sm font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}>{t("todayGrateful")}</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full h-24 p-4 rounded-xl resize-none focus:outline-none mb-3 ${dark ? "bg-white/5 text-gray-200 placeholder-gray-600 border border-white/10" : "bg-cream/50 text-gray-800 border border-gray-200 focus:border-rose"}`}
            placeholder="I'm grateful for..."
            required
          />
          <div className="flex flex-wrap gap-2 mb-4">
            {moods.map((m) => (
              <button key={m} type="button" onClick={() => setMood(m)} className={`px-3 py-1 rounded-full text-sm transition ${mood === m ? "bg-rose text-white" : (dark ? "bg-white/10 text-gray-300" : "bg-rose/10 text-rose")}`}>
                {m}
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="w-full py-3 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl font-semibold shadow-md">
            {t("addGratitude")} ✨
          </motion.button>
        </form>

        {/* Toggle monthly */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-heading font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
            {showMonthly ? t("monthlyReflection") : "All Entries"}
          </h2>
          <button onClick={() => setShowMonthly(!showMonthly)} className={`text-sm font-medium ${dark ? "text-rose-light" : "text-rose"}`}>
            {showMonthly ? "Show All" : "Monthly View"}
          </button>
        </div>

        {/* Entries */}
        <div className="space-y-4">
          {(showMonthly ? monthlyData : items).length === 0 && (
            <p className={`text-center py-8 ${dark ? "text-gray-600" : "text-gray-400"}`}>No entries yet. Start your gratitude journey!</p>
          )}
          {(showMonthly ? monthlyData : items).slice().reverse().map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-5 ${dark ? `bg-white/5 border border-white/5` : `bg-gradient-to-br ${gradients[i % gradients.length]} shadow-sm`}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{entry.date}</span>
                  <span className="text-xs">{entry.mood}</span>
                </div>
                <button onClick={() => remove(entry.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
              </div>
              <p className={`text-sm leading-relaxed ${dark ? "text-gray-300" : "text-gray-700"}`}>{entry.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
