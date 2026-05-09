"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { fileToBase64 } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import ShareButton from "@/components/ShareButton";
import DarkStars from "@/components/DarkStars";

const templates = [
  { id: "mothersDay", labelKey: "templateMothersDay", emoji: "💐", bg: "from-rose via-pink-400 to-lavender", accent: "🌸" },
  { id: "love", labelKey: "templateILoveYou", emoji: "❤️", bg: "from-red-500 via-rose to-pink-500", accent: "💕" },
  { id: "thankYou", labelKey: "templateThankYou", emoji: "🙏", bg: "from-gold via-amber-400 to-yellow-300", accent: "✨" },
  { id: "hero", labelKey: "templateHero", emoji: "🦸", bg: "from-indigo-500 via-purple-500 to-lavender", accent: "🌟" },
  { id: "birthday", labelKey: "birthday", emoji: "🎂", bg: "from-pink-400 via-rose to-purple-500", accent: "🎉" },
  { id: "grateful", labelKey: "gratitude", emoji: "🙏", bg: "from-emerald-400 via-teal-400 to-cyan-400", accent: "💚" },
];

const colorThemes = [
  { name: "Rose", bg: "from-rose via-pink-400 to-lavender" },
  { name: "Gold", bg: "from-gold via-amber-400 to-yellow-300" },
  { name: "Purple", bg: "from-indigo-500 via-purple-500 to-lavender" },
  { name: "Ocean", bg: "from-cyan-400 via-blue-400 to-indigo-500" },
  { name: "Sunset", bg: "from-orange-400 via-rose to-purple-500" },
  { name: "Forest", bg: "from-emerald-400 via-teal-400 to-cyan-400" },
];

const fontOptions = [
  { name: "Playfair", value: "'Playfair Display', serif" },
  { name: "Dancing Script", value: "'Dancing Script', cursive" },
  { name: "Pacifico", value: "'Pacifico', cursive" },
  { name: "Great Vibes", value: "'Great Vibes', cursive" },
  { name: "Satisfy", value: "'Satisfy', cursive" },
];

const stickers = ["🌸", "🌺", "💕", "✨", "🌟", "💐", "🦋", "❤️", "💖", "🩷", "🎀", "👑"];

const defaultMessages: Record<string, string> = {
  mothersDay: "Happy Mother's Day! You are the heart of our family. Your love makes everything beautiful. ❤️",
  love: "I love you more than words can express. You are my world, my everything. ❤️",
  thankYou: "Thank you for everything, Mom. Your love, sacrifices, and wisdom shaped who I am today. 🙏",
  hero: "You're my hero, Mom. Your strength, courage, and love inspire me every single day. 🌟",
  birthday: "Happy Birthday to the most amazing mom! May your day be as wonderful as you are! 🎂",
  grateful: "Forever grateful for your love, patience, and warmth. You make the world a better place. 💚",
};

export default function Card() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [momName, setMomName] = useState("");
  const [message, setMessage] = useState(defaultMessages.mothersDay);
  const [photo, setPhoto] = useState("");
  const [colorTheme, setColorTheme] = useState(colorThemes[0]);
  const [font, setFont] = useState(fontOptions[0]);
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTemplateChange = (tmpl: typeof templates[0]) => {
    setSelectedTemplate(tmpl);
    setMessage(defaultMessages[tmpl.id] || "");
  };

  const toggleSticker = (s: string) => {
    setSelectedStickers((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : prev.length < 6 ? [...prev, s] : prev
    );
  };

  const generate = async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null, useCORS: true });
    const link = document.createElement("a");
    link.download = `loveyoumom-card-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">💐</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("cardTemplates")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>Create a beautiful card for her</p>
        </motion.div>

        {/* Template selection */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {templates.map((tmpl) => (
            <button key={tmpl.id} onClick={() => handleTemplateChange(tmpl)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${selectedTemplate.id === tmpl.id ? "bg-rose text-white shadow-lg" : dark ? "bg-white/10 text-gray-300" : "bg-white shadow text-gray-700"}`}>
              <span className="text-base">{tmpl.emoji}</span>
              <span>{t(tmpl.labelKey)}</span>
            </button>
          ))}
        </div>

        {/* Customization */}
        <div className={`rounded-2xl p-6 mb-8 space-y-4 ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
          <input type="text" value={momName} onChange={(e) => setMomName(e.target.value)}
            className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`}
            placeholder={t("momName")} />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)}
            className={`w-full p-3 rounded-xl border focus:outline-none h-24 resize-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`}
            placeholder={t("message")} />
          <label className="block text-sm text-gray-500">{t("photo")} (optional)</label>
          <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPhoto(await fileToBase64(f)); }} className="w-full text-sm" />

          {/* Stickers */}
          <div>
            <p className={`text-sm font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>Stickers</p>
            <div className="flex flex-wrap gap-2">
              {stickers.map((s) => (
                <button key={s} onClick={() => toggleSticker(s)}
                  className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition ${selectedStickers.includes(s) ? "bg-rose/20 ring-2 ring-rose scale-110" : dark ? "bg-white/5" : "bg-gray-50"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color theme */}
          <div>
            <p className={`text-sm font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>{t("colorTheme")}</p>
            <div className="flex gap-2">
              {colorThemes.map((ct) => (
                <button key={ct.name} onClick={() => setColorTheme(ct)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${ct.bg} ${colorTheme.name === ct.name ? "ring-2 ring-offset-2 ring-rose" : ""}`} title={ct.name} />
              ))}
            </div>
          </div>

          {/* Font */}
          <div>
            <p className={`text-sm font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>{t("fontChoice")}</p>
            <div className="flex flex-wrap gap-2">
              {fontOptions.map((f) => (
                <button key={f.name} onClick={() => setFont(f)}
                  className={`px-3 py-1 rounded-full text-sm transition ${font.name === f.name ? "bg-lavender text-white" : dark ? "bg-white/10 text-gray-300" : "bg-lavender/10 text-lavender"}`}
                  style={{ fontFamily: f.value }}>
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generate}
              className="flex-1 py-3 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl font-semibold shadow-md">
              🎨 {t("generateCard")}
            </motion.button>
            <ShareButton cardRef={cardRef} shareText={`I made a card for my mom! ❤️ #LoveYouMom #BuiltWithTRAE`} />
          </div>
        </div>

        {/* Card Preview */}
        <div ref={cardRef} className={`bg-gradient-to-br ${colorTheme.bg} rounded-3xl p-8 text-center text-white shadow-2xl min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden`}>
          <div className="absolute top-4 left-4 text-4xl opacity-30">{selectedTemplate.accent}</div>
          <div className="absolute top-4 right-4 text-4xl opacity-30">{selectedTemplate.accent}</div>
          <div className="absolute bottom-4 left-4 text-4xl opacity-30">{selectedTemplate.accent}</div>
          <div className="absolute bottom-4 right-4 text-4xl opacity-30">{selectedTemplate.accent}</div>

          {/* Stickers on card */}
          {selectedStickers.map((s, i) => (
            <div key={i} className="absolute text-3xl opacity-40"
              style={{
                top: `${15 + (i * 20) % 70}%`,
                left: `${10 + (i * 25) % 80}%`,
                transform: `rotate(${(i * 15) - 30}deg)`,
              }}>
              {s}
            </div>
          ))}

          <div className="text-6xl mb-4">{selectedTemplate.emoji}</div>
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: font.value }}>Love You Mom</h2>
          {momName && <p className="text-lg font-semibold mb-4" style={{ fontFamily: font.value }}>For {momName}</p>}
          <div className="w-16 h-0.5 bg-white/40 mx-auto mb-4" />
          <p className="text-lg italic max-w-sm leading-relaxed" style={{ fontFamily: font.value }}>&ldquo;{message}&rdquo;</p>
          {photo && <img src={photo} alt="" className="mt-6 w-32 h-32 rounded-full object-cover border-4 border-white/30" />}
          <p className="mt-6 text-sm opacity-70">— With all my love ❤️</p>
          <p className="text-xs opacity-40 mt-2">#LoveYouMom #BuiltWithTRAE</p>
        </div>
      </div>
    </div>
  );
}
