"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { fileToBase64 } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import ShareButton from "@/components/ShareButton";
import DarkStars from "@/components/DarkStars";

const layouts = [
  { id: "grid2", label: "Grid 2×2", cols: 2, rows: 2, max: 4 },
  { id: "grid3", label: "Grid 3×3", cols: 3, rows: 3, max: 9 },
  { id: "heart", label: "Heart", cols: 3, rows: 3, max: 7 },
  { id: "strip", label: "Photo Strip", cols: 1, rows: 4, max: 4 },
];

const bgGradients = [
  { name: "Rose", value: "from-rose-400 to-pink-300" },
  { name: "Lavender", value: "from-purple-400 to-indigo-300" },
  { name: "Sunset", value: "from-orange-400 to-rose-400" },
  { name: "Ocean", value: "from-cyan-400 to-blue-400" },
  { name: "Gold", value: "from-amber-400 to-yellow-300" },
  { name: "Forest", value: "from-emerald-400 to-green-300" },
];

export default function Collage() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const [layout, setLayout] = useState(layouts[0]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState("Love You Mom ❤️");
  const [bg, setBg] = useState(bgGradients[0]);
  const collageRef = useRef<HTMLDivElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    for (const f of Array.from(files)) {
      if (photos.length + newPhotos.length < layout.max) {
        newPhotos.push(await fileToBase64(f));
      }
    }
    setPhotos([...photos, ...newPhotos]);
  };

  const removePhoto = (idx: number) => setPhotos(photos.filter((_, i) => i !== idx));

  const heartPositions = [
    { col: 1, row: 0 }, { col: 2, row: 0 },
    { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }, { col: 3, row: 1 },
    { col: 1, row: 2 }, { col: 2, row: 2 },
  ];

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🖼️</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("collageTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("collageDesc")}</p>
        </motion.div>

        {/* Layout Selection */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {layouts.map((l) => (
            <button key={l.id} onClick={() => { setLayout(l); setPhotos([]); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${layout.id === l.id ? "bg-rose text-white shadow-lg" : dark ? "bg-white/10 text-gray-300" : "bg-white shadow text-gray-700"}`}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className={`rounded-2xl p-6 mb-8 space-y-4 ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`}
            placeholder={t("collageTitleLabel")} />
          <div>
            <p className={`text-sm font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>{t("colorTheme")}</p>
            <div className="flex gap-2 flex-wrap">
              {bgGradients.map((g) => (
                <button key={g.name} onClick={() => setBg(g)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${g.value} ${bg.name === g.name ? "ring-2 ring-offset-2 ring-rose" : ""}`}
                  title={g.name} />
              ))}
            </div>
          </div>
          <label className={`block text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
            {t("addPhotos")} (max {layout.max})
          </label>
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="w-full text-sm" />
        </div>

        {/* Collage Preview */}
        <div className="flex justify-center mb-6">
          <ShareButton cardRef={collageRef} />
        </div>

        <div className="flex justify-center">
          <div ref={collageRef} className={`bg-gradient-to-br ${bg.value} rounded-3xl p-6 shadow-2xl`} style={{ width: layout.id === "strip" ? 280 : 420, minHeight: layout.id === "strip" ? 600 : 420 }}>
            <h2 className="text-center text-white font-heading font-bold text-xl mb-4 drop-shadow-lg">{title}</h2>
            {layout.id === "heart" ? (
              <div className="grid grid-cols-4 gap-2" style={{ width: 360, margin: "0 auto" }}>
                {heartPositions.map((pos, i) => (
                  <div key={i} style={{ gridColumn: pos.col + 1, gridRow: pos.row + 1 }} className="aspect-square">
                    {photos[i] ? (
                      <img src={photos[i]} alt="" className="w-full h-full object-cover rounded-lg shadow-md" />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-white/20 flex items-center justify-center text-white/50 text-2xl">+</div>
                    )}
                  </div>
                ))}
              </div>
            ) : layout.id === "strip" ? (
              <div className="space-y-2">
                {Array.from({ length: layout.max }).map((_, i) => (
                  photos[i] ? (
                    <img key={i} src={photos[i]} alt="" className="w-full rounded-lg shadow-md" />
                  ) : (
                    <div key={i} className="w-full h-[130px] rounded-lg bg-white/20 flex items-center justify-center text-white/50 text-2xl">+</div>
                  )
                ))}
              </div>
            ) : (
              <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)` }}>
                {Array.from({ length: layout.cols * layout.rows }).map((_, i) => (
                  photos[i] ? (
                    <div key={i} className="relative group">
                      <img src={photos[i]} alt="" className="w-full aspect-square object-cover rounded-lg shadow-md" />
                      <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ) : (
                    <div key={i} className="aspect-square rounded-lg bg-white/20 flex items-center justify-center text-white/50 text-2xl">+</div>
                  )
                ))}
              </div>
            )}
            <p className="text-center text-white/70 text-xs mt-4">#LoveYouMom #BuiltWithTRAE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
