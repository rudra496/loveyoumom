"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWisdom, getGradient } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";

export default function Wisdom() {
  const { items, add } = useWisdom();
  const { t } = useLang();
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add({ text, author: author || "Mom" });
    setText("");
    setAuthor("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-2">💭 {t("wisdom")}</h1>
        <p className="text-gray-500">Her words of wisdom, forever remembered</p>
      </motion.div>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowForm(true)} className="w-full mb-8 py-3 bg-gradient-to-r from-lavender to-purple-400 text-white rounded-xl font-semibold shadow-md">
        + {t("addWisdom")}
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-4 overflow-hidden">
            <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:border-lavender focus:outline-none h-24 resize-none" placeholder="Her wisdom..." required />
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:border-lavender focus:outline-none" placeholder="Who said it?" />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-2 bg-lavender text-white rounded-xl font-semibold">{t("save")}</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold">{t("cancel")}</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {items.length === 0 && <p className="text-center text-gray-400 py-12">{t("noWisdom")}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${item.gradient || getGradient(i)} rounded-2xl p-6 text-white shadow-lg`}
          >
            <p className="text-2xl font-heading italic leading-relaxed">&ldquo;{item.text}&rdquo;</p>
            {item.author && <p className="mt-4 text-sm font-semibold opacity-80">— {item.author}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
