"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoveLetters } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import DarkStars from "@/components/DarkStars";

const templates: Record<string, string> = {
  mother: `Dear Mom,\n\nNo words can express how much you mean to me. You are my first teacher, my best friend, and my greatest inspiration. Every sacrifice you made has shaped who I am today.\n\nThank you for loving me unconditionally, for believing in me when I couldn't believe in myself, and for making our house a home.\n\nI love you more than words can say.\n\nForever yours ❤️`,
  thankYou: `Dear Mom,\n\nThank you. Two simple words, but they carry the weight of a lifetime of gratitude.\n\nThank you for the sleepless nights, for the meals you cooked with love, for the tears you wiped away, and for the laughter you brought into my life.\n\nThank you for being you.\n\nWith all my love ❤️`,
  grandma: `Dear Grandma,\n\nYou are the root of our family tree. Your stories, your wisdom, your gentle spirit — they live on in all of us.\n\nEvery time I cook your recipes, I feel your presence. Every time I hear your words of wisdom, I feel your guidance.\n\nYou are forever in my heart.\n\nLove always 🌸`,
  afar: `Dear Mom,\n\nMiles apart, but you're always in my heart.\n\nEvery sunrise reminds me of your smile. Every meal I cook reminds me of your kitchen. Every challenge I face reminds me of your strength.\n\nI miss you more than words can say, but I carry you with me everywhere.\n\nCan't wait to see you again ❤️`,
};

const fonts = [
  { name: "Dancing Script", value: "'Dancing Script', cursive" },
  { name: "Satisfy", value: "'Satisfy', cursive" },
  { name: "Pacifico", value: "'Pacifico', cursive" },
  { name: "Great Vibes", value: "'Great Vibes', cursive" },
  { name: "Default", value: "inherit" },
];

export default function LoveLetter() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { items, add, remove } = useLoveLetters();
  const [content, setContent] = useState(templates.mother);
  const [font, setFont] = useState(fonts[0].value);
  const [revealed, setRevealed] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("mother");
  const [savedLetters, setSavedLetters] = useState(false);

  const applyTemplate = (key: string) => {
    setSelectedTemplate(key);
    setContent(templates[key]);
    setRevealed(false);
  };

  const saveLetter = () => {
    add({ content, template: selectedTemplate, date: new Date().toISOString().split("T")[0], fontFamily: font });
  };

  const printLetter = () => {
    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(`<html><head><link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Satisfy&family=Pacifico&family=Great+Vibes&display=swap" rel="stylesheet"><style>body{font-family:${font};padding:60px;line-height:2;font-size:18px;color:#333;max-width:600px;margin:auto;}h2{text-align:center;margin-bottom:20px;}</style></head><body><h2>💌 A Letter to Mom</h2><pre style="white-space:pre-wrap;font-family:inherit;">${content}</pre><p style="text-align:center;margin-top:40px;">— With all my love ❤️</p></body></html>`);
      printWin.document.close();
      printWin.print();
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="text-5xl mb-4">💌</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("loveLetterTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("loveLetterDesc")}</p>
        </motion.div>

        {/* Templates */}
        <div className={`rounded-2xl p-4 mb-6 ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
          <p className={`text-sm font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}>{t("chooseTemplate")}</p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "mother", label: t("templateMother") },
              { key: "thankYou", label: t("templateThankYou") },
              { key: "grandma", label: t("templateGrandma") },
              { key: "afar", label: t("templateFromAfar") },
            ].map((tmpl) => (
              <button key={tmpl.key} onClick={() => applyTemplate(tmpl.key)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedTemplate === tmpl.key ? "bg-rose text-white" : (dark ? "bg-white/10 text-gray-300" : "bg-rose/10 text-rose")}`}>
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font selection */}
        <div className={`rounded-2xl p-4 mb-6 ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
          <p className={`text-sm font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}>{t("fontChoice")}</p>
          <div className="flex flex-wrap gap-2">
            {fonts.map((f) => (
              <button key={f.name} onClick={() => { setFont(f.value); setRevealed(false); }} className={`px-4 py-2 rounded-full text-sm transition ${font === f.value ? "bg-lavender text-white" : (dark ? "bg-white/10 text-gray-300" : "bg-lavender/10 text-lavender")}`} style={{ fontFamily: f.value }}>
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Letter editor */}
        <div className={`rounded-2xl p-6 mb-6 stationery-border ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setRevealed(false); }}
            className={`w-full h-64 p-4 rounded-xl resize-none focus:outline-none ${dark ? "bg-transparent text-gray-200 placeholder-gray-600" : "bg-cream/50 text-gray-800"}`}
            style={{ fontFamily: font, fontSize: "16px", lineHeight: "1.8" }}
            placeholder={t("writeLetter")}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setRevealed(!revealed)} className="flex-1 py-3 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl font-semibold shadow-md">
            {revealed ? "✏️ Edit" : t("revealLetter")}
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={saveLetter} className="flex-1 py-3 bg-gradient-to-r from-lavender to-purple-400 text-white rounded-xl font-semibold shadow-md">
            {t("save")} 📌
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={printLetter} className="flex-1 py-3 bg-gradient-to-r from-gold to-amber-400 text-white rounded-xl font-semibold shadow-md">
            {t("printLetter")} 🖨️
          </motion.button>
        </div>

        {/* Revealed letter */}
        {revealed && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-2xl p-8 mb-8 stationery-border ${dark ? "bg-white/5" : "bg-white shadow-lg"}`}>
            <div className="text-center mb-4 text-3xl">💌</div>
            <div style={{ fontFamily: font, fontSize: "18px", lineHeight: "2" }} className={dark ? "text-gray-200" : "text-gray-800"}>
              {content.split("\n").map((line, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {line}
                  <br />
                </motion.span>
              ))}
            </div>
            <div className="text-center mt-6 text-sm text-gray-400">— With all my love ❤️</div>
          </motion.div>
        )}

        {/* Saved letters */}
        {items.length > 0 && (
          <div>
            <button onClick={() => setSavedLetters(!savedLetters)} className={`text-sm font-semibold mb-4 ${dark ? "text-rose-light" : "text-rose"}`}>
              📁 Saved Letters ({items.length}) {savedLetters ? "▼" : "▶"}
            </button>
            <AnimatePresence>
              {savedLetters && items.map((item) => (
                <motion.div key={item.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`rounded-2xl p-5 mb-4 ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <button onClick={() => remove(item.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                  </div>
                  <p className={`text-sm whitespace-pre-line line-clamp-3 ${dark ? "text-gray-300" : "text-gray-600"}`} style={{ fontFamily: item.fontFamily }}>{item.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
