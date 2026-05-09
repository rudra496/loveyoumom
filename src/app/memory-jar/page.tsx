"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemoryJar } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import DarkStars from "@/components/DarkStars";

const noteColors = [
  "from-rose to-pink-300",
  "from-lavender to-purple-300",
  "from-gold to-amber-300",
  "from-cyan-400 to-blue-300",
  "from-emerald-400 to-green-300",
  "from-orange-400 to-amber-300",
];

export default function MemoryJar() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { items, add, remove } = useMemoryJar();
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [color, setColor] = useState(noteColors[0]);
  const [drawnNote, setDrawnNote] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    add({ text, color, date: new Date().toISOString().split("T")[0] });
    setText(""); setColor(noteColors[0]); setShowForm(false);
  };

  const drawNote = () => {
    if (items.length === 0) return;
    setShaking(true);
    setTimeout(() => {
      const random = items[Math.floor(Math.random() * items.length)];
      setDrawnNote(random.id);
      setShaking(false);
    }, 800);
  };

  const fillLevel = Math.min(100, items.length * 12);

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🫙</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("jarTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("jarDesc")}</p>
        </motion.div>

        {/* Jar Visualization */}
        <div className="flex justify-center mb-8">
          <motion.div
            className={`relative w-64 ${shaking ? "jar-shake" : ""}`}
          >
            {/* Jar body */}
            <div className={`relative w-64 h-80 rounded-b-[4rem] rounded-t-3xl overflow-hidden ${dark ? "bg-white/5 border-2 border-white/10" : "bg-white/60 border-2 border-white/80"} backdrop-blur-sm shadow-2xl`}>
              {/* Glass shine */}
              <div className={`absolute left-3 top-0 bottom-0 w-4 ${dark ? "bg-white/5" : "bg-white/40"} rounded-full`} />

              {/* Notes inside jar */}
              <div className="absolute inset-4 overflow-hidden flex flex-wrap gap-1 items-end content-end p-2">
                {items.map((note, i) => (
                  <motion.div
                    key={note.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`w-8 h-6 rounded-sm bg-gradient-to-br ${note.color} opacity-80 cursor-pointer hover:opacity-100 hover:scale-125 transition-all shadow-sm`}
                    style={{ transform: `rotate(${(i * 17) % 30 - 15}deg)` }}
                    title={note.text}
                    onClick={() => setDrawnNote(note.id)}
                  />
                ))}
              </div>

              {/* Jar lid */}
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-44 h-8 rounded-t-xl ${dark ? "bg-white/10" : "bg-white/90"} border-2 ${dark ? "border-white/10" : "border-white/60"} shadow-lg flex items-center justify-center`}>
                <span className="text-xs">💕</span>
              </div>

              {/* Fill level indicator */}
              <div className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-[4rem]" style={{ height: `${fillLevel}%` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-rose/10 to-transparent" />
              </div>
            </div>

            {/* Label */}
            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-lg ${dark ? "bg-white/10 text-gray-300" : "bg-rose/10 text-rose"} text-xs font-semibold`}>
              {items.length} notes of love
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center mb-8">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl font-semibold shadow-md">
            + {t("addNote")}
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={drawNote}
            className={`px-6 py-3 rounded-xl font-semibold ${dark ? "bg-white/10 text-white" : "bg-white shadow text-gray-700"}`}>
            🎲 {t("drawNote")}
          </motion.button>
        </div>

        {/* Drawn Note Display */}
        <AnimatePresence>
          {drawnNote && (() => {
            const note = items.find((n) => n.id === drawnNote);
            if (!note) return null;
            return (
              <motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }}
                className="mb-8 note-unfold">
                <div className={`bg-gradient-to-br ${note.color} rounded-2xl p-8 text-center shadow-2xl`}>
                  <p className="text-white text-lg font-medium italic leading-relaxed">&ldquo;{note.text}&rdquo;</p>
                  <p className="text-white/60 text-xs mt-3">{note.date}</p>
                  <button onClick={() => setDrawnNote(null)} className="mt-4 text-white/70 text-sm hover:text-white">Close</button>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Add Note Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAdd}
              className={`rounded-2xl p-6 space-y-4 overflow-hidden ${dark ? "bg-white/5" : "bg-white shadow-lg"}`}>
              <textarea value={text} onChange={(e) => setText(e.target.value)} required
                className={`w-full p-3 rounded-xl border focus:outline-none h-24 resize-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`}
                placeholder={t("noteText")} />
              <div>
                <p className={`text-sm font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>{t("colorTheme")}</p>
                <div className="flex gap-2">
                  {noteColors.map((c) => (
                    <button key={c} type="button" onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} ${color === c ? "ring-2 ring-offset-2 ring-rose" : ""}`} />
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

        {/* All Notes List */}
        <div className="mt-8 space-y-2">
          {items.map((note, i) => (
            <motion.div key={note.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`rounded-xl p-3 flex items-center gap-3 ${dark ? "bg-white/5" : "bg-white shadow-sm"}`}>
              <div className={`w-6 h-6 rounded bg-gradient-to-br ${note.color} flex-shrink-0`} />
              <p className={`text-sm flex-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>{note.text}</p>
              <button onClick={() => remove(note.id)} className="text-gray-400 hover:text-rose text-xs">✕</button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
