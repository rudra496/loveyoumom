"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemories, fileToBase64, type Memory } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";

export default function Timeline() {
  const { items, add } = useMemories();
  const { t } = useLang();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Memory, "id">>({ date: "", title: "", description: "", photo: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add(form);
    setForm({ date: "", title: "", description: "", photo: "" });
    setShowForm(false);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm({ ...form, photo: await fileToBase64(file) });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-2">📜 {t("timeline")}</h1>
        <p className="text-gray-500">{t("heroTagline")}</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={() => setShowForm(true)}
        className="w-full mb-8 py-3 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl font-semibold shadow-md"
      >
        + {t("addMemory")}
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-4 overflow-hidden"
          >
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:border-rose focus:outline-none" placeholder={t("date")} />
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:border-rose focus:outline-none" placeholder={t("title")} required />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:border-rose focus:outline-none h-24 resize-none" placeholder={t("description")} required />
            <label className="block text-sm text-gray-500">{t("uploadPhoto")}</label>
            <input type="file" accept="image/*" onChange={handlePhoto} className="w-full text-sm" />
            {form.photo && <img src={form.photo} alt="preview" className="w-32 h-32 object-cover rounded-xl" />}
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-2 bg-rose text-white rounded-xl font-semibold">{t("save")}</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold">{t("cancel")}</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-rose/30" />
        {items.length === 0 && <p className="text-center text-gray-400 py-12">{t("noMemories")}</p>}
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`relative flex items-start mb-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
          >
            <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-rose rounded-full border-4 border-cream -translate-x-1/2 z-10" />
            <div className={`ml-12 md:ml-0 md:w-[45%] ${i % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
              <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow">
                <span className="text-xs text-rose font-semibold">{item.date}</span>
                <h3 className="font-heading font-semibold text-lg text-gray-800 mt-1">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{item.description}</p>
                {item.photo && <img src={item.photo} alt={item.title} className="mt-3 w-full rounded-xl object-cover max-h-48" />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
