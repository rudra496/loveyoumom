"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGallery, fileToBase64 } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";

const moods = ["😊 Happy", "😢 Nostalgic", "❤️ Love", "🎉 Celebration", "🌸 Peaceful"];

export default function Gallery() {
  const { items, add } = useGallery();
  const { t } = useLang();
  const [showForm, setShowForm] = useState(false);
  const [photo, setPhoto] = useState("");
  const [date, setDate] = useState("");
  const [mood, setMood] = useState(moods[0]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add({ photo, date, mood });
    setPhoto("");
    setDate("");
    setMood(moods[0]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-2">📸 {t("gallery")}</h1>
        <p className="text-gray-500">A visual journey through memories</p>
      </motion.div>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowForm(true)} className="w-full mb-8 py-3 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl font-semibold shadow-md">
        + {t("uploadPhoto")}
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-4 overflow-hidden">
            <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPhoto(await fileToBase64(f)); }} className="w-full text-sm" required />
            {photo && <img src={photo} alt="preview" className="w-40 h-40 object-cover rounded-xl mx-auto" />}
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:border-rose focus:outline-none" required />
            <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:border-rose focus:outline-none">
              {moods.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-2 bg-rose text-white rounded-xl font-semibold">{t("save")}</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold">{t("cancel")}</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {items.length === 0 && <p className="text-center text-gray-400 py-12">{t("noPhotos")}</p>}

      <div className="masonry">
        {items.map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="break-inside-avoid mb-4">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLightbox(item.photo)}>
              <img src={item.photo} alt="" className="w-full" />
              <div className="p-3">
                <span className="text-xs text-gray-400">{item.date}</span>
                <span className="text-xs ml-2">{item.mood}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" className="max-w-full max-h-full rounded-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
