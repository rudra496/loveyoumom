"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGallery, fileToBase64 } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import DarkStars from "@/components/DarkStars";

const moods = ["😊 Happy", "😢 Nostalgic", "❤️ Love", "🎉 Celebration", "🌸 Peaceful"];
const photoFilters = [
  { id: "none", label: "Normal", css: "" },
  { id: "warm", label: "Warm", css: "sepia(0.2) saturate(1.3) brightness(1.05)" },
  { id: "vintage", label: "Vintage", css: "sepia(0.4) contrast(1.05) brightness(0.95)" },
  { id: "bw", label: "B&W", css: "grayscale(1)" },
  { id: "vibrant", label: "Vibrant", css: "saturate(1.5) contrast(1.05)" },
  { id: "dreamy", label: "Dreamy", css: "blur(0.5px) brightness(1.1) saturate(1.2)" },
];

export default function Gallery() {
  const { items, add } = useGallery();
  const { t } = useLang();
  const { dark } = useDarkMode();
  const [showForm, setShowForm] = useState(false);
  const [photo, setPhoto] = useState("");
  const [date, setDate] = useState("");
  const [mood, setMood] = useState(moods[0]);
  const [caption, setCaption] = useState("");
  const [filter, setFilter] = useState("none");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [slideshow, setSlideshow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add({ photo, date, mood, caption });
    setPhoto(""); setDate(""); setMood(moods[0]); setCaption(""); setShowForm(false);
  };

  const openSlideshow = (idx: number) => {
    setLightboxIdx(idx);
    setLightbox(items[idx]?.photo || null);
    setSlideshow(true);
  };

  const nextSlide = () => {
    const next = (lightboxIdx + 1) % items.length;
    setLightboxIdx(next);
    setLightbox(items[next]?.photo || null);
  };
  const prevSlide = () => {
    const prev = (lightboxIdx - 1 + items.length) % items.length;
    setLightboxIdx(prev);
    setLightbox(items[prev]?.photo || null);
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 max-w-6xl mx-auto ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 relative z-10">
        <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>📸 {t("gallery")}</h1>
        <p className={dark ? "text-gray-400" : "text-gray-500"}>A visual journey through memories</p>
      </motion.div>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={() => setShowForm(true)}
        className="w-full mb-8 py-3 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl font-semibold shadow-md relative z-10">
        + {t("uploadPhoto")}
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className={`rounded-2xl shadow-lg p-6 mb-8 space-y-4 overflow-hidden relative z-10 ${dark ? "bg-white/5" : "bg-white"}`}>
            <input type="file" accept="image/*"
              onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPhoto(await fileToBase64(f)); }}
              className="w-full text-sm" required />
            {photo && (
              <div>
                <img src={photo} alt="preview" className="w-40 h-40 object-cover rounded-xl mx-auto"
                  style={{ filter: photoFilters.find((f) => f.id === filter)?.css }} />
                <div className="flex gap-2 justify-center mt-3 flex-wrap">
                  {photoFilters.map((f) => (
                    <button key={f.id} type="button" onClick={() => setFilter(f.id)}
                      className={`px-2 py-1 rounded text-xs ${filter === f.id ? "bg-rose text-white" : dark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`} required />
            <select value={mood} onChange={(e) => setMood(e.target.value)}
              className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200"}`}>
              {moods.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)}
              className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`}
              placeholder="Caption (optional)" />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-2 bg-rose text-white rounded-xl font-semibold">{t("save")}</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold">{t("cancel")}</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {items.length === 0 && <p className="text-center text-gray-400 py-12 relative z-10">{t("noPhotos")}</p>}

      <div className="masonry relative z-10">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="break-inside-avoid mb-4">
            <div className={`rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group ${dark ? "bg-white/5" : "bg-white"}`}
              onClick={() => openSlideshow(i)}>
              <div className="relative">
                <img src={item.photo} alt="" className="w-full" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-3xl transition-opacity">🔍</span>
                </div>
              </div>
              <div className="p-3">
                {item.caption && <p className={`text-sm font-medium mb-1 ${dark ? "text-gray-200" : "text-gray-700"}`}>{item.caption}</p>}
                <span className="text-xs text-gray-400">{item.date}</span>
                <span className="text-xs ml-2">{item.mood}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Slideshow Lightbox */}
      <AnimatePresence>
        {lightbox && slideshow && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => { setSlideshow(false); setLightbox(null); }}>
            <button onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-4 text-white/70 hover:text-white text-4xl z-10">❮</button>
            <motion.img key={lightboxIdx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              src={lightbox} alt="" className="max-w-[90vw] max-h-[80vh] rounded-xl object-contain" />
            <button onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-4 text-white/70 hover:text-white text-4xl z-10">❯</button>
            <div className="absolute bottom-6 text-white/50 text-sm">{lightboxIdx + 1} / {items.length}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Lightbox (single image from click) */}
      <AnimatePresence>
        {lightbox && !slideshow && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" className="max-w-full max-h-full rounded-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
