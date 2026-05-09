"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBucketList, fileToBase64 } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import Confetti from "@/components/Confetti";
import DarkStars from "@/components/DarkStars";

const categories = ["Adventures", "Food", "Quality Time", "Learning"];

export default function BucketList() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { items, add, toggle } = useBucketList();
  const confetti = Confetti();
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [cat, setCat] = useState(categories[0]);
  const [filter, setFilter] = useState("All");

  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    add({ text, category: cat, completed: false });
    setText(""); setCat(categories[0]); setShowForm(false);
  };

  const handleToggle = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item && !item.completed) confetti.fire();
    toggle(id);
  };

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("bucketListTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("bucketListDesc")}</p>
        </motion.div>

        {/* Progress */}
        <div className={`rounded-2xl p-6 mb-8 ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>{t("completed")}: {completed}</span>
            <span className={`text-sm font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>{t("remaining")}: {total - completed}</span>
          </div>
          <div className={`w-full h-3 rounded-full ${dark ? "bg-white/10" : "bg-gray-200"}`}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              className="h-full rounded-full bg-gradient-to-r from-rose to-lavender" transition={{ duration: 1 }} />
          </div>
          <p className={`text-center mt-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{pct}% complete</p>
        </div>

        {/* Filters & Add */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl text-sm font-semibold shadow-md">
            + {t("addItem")}
          </button>
          {["All", ...categories].map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === c ? "bg-rose text-white" : dark ? "bg-white/10 text-gray-300" : "bg-white shadow text-gray-600"}`}>
              {t(c.toLowerCase().replace(" ", "") as keyof typeof t) || c}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAdd}
              className={`rounded-2xl p-6 mb-8 space-y-4 overflow-hidden ${dark ? "bg-white/5" : "bg-white shadow-lg"}`}>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} required
                className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`}
                placeholder="What do you want to do together?" />
              <select value={cat} onChange={(e) => setCat(e.target.value)}
                className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200"}`}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2 bg-rose text-white rounded-xl font-semibold">{t("save")}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold">{t("cancel")}</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* List */}
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={`rounded-xl p-4 flex items-center gap-4 transition card-3d ${dark ? "bg-white/5" : "bg-white shadow-sm"}`}>
              <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleToggle(item.id)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${item.completed ? "bg-rose border-rose text-white" : dark ? "border-white/20" : "border-gray-300"}`}>
                {item.completed && "✓"}
              </motion.button>
              <div className="flex-1">
                <p className={`${item.completed ? "line-through text-gray-400" : dark ? "text-gray-200" : "text-gray-800"} ${item.completed ? "" : "font-medium"}`}>
                  {item.text}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${dark ? "bg-white/10 text-gray-400" : "bg-rose/10 text-rose"}`}>
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
