"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useVoices } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";

export default function Bedtime() {
  const { items } = useVoices();
  const { t } = useLang();
  const [night, setNight] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stars = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${1.5 + Math.random() * 2}s`,
    size: `${1 + Math.random() * 3}px`,
  })), []);

  const togglePlay = (id: string, audio: string) => {
    if (playing === id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const a = new Audio(audio);
      a.onended = () => setPlaying(null);
      a.play();
      audioRef.current = a;
      setPlaying(id);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${night ? "bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950" : "bg-gradient-to-b from-cream to-pink-50"}`}>
      {/* Stars */}
      {night && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {stars.map((s) => (
            <div key={s.id} className="star absolute rounded-full bg-white" style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration }} />
          ))}
        </div>
      )}

      <div className="relative z-10 pt-24 pb-20 px-4 max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-6xl mb-4">{night ? "🌙" : "☀️"}</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${night ? "text-white" : "text-gray-800"}`}>
            {night ? t("bedtime") : "Good Morning! ☀️"}
          </h1>
          <p className={`mb-8 ${night ? "text-gray-300" : "text-gray-500"}`}>
            {night ? "Listen to lullabies and stories under the stars" : "A beautiful day to make memories"}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setNight(!night)}
            className={`px-6 py-3 rounded-full font-semibold shadow-md ${night ? "bg-white/10 text-white border border-white/20" : "bg-gradient-to-r from-rose to-pink-400 text-white"}`}
          >
            {night ? "☀️ Day Mode" : "🌙 Night Mode"}
          </motion.button>
        </motion.div>

        {/* Recordings */}
        <div className="mt-12 space-y-4">
          <h2 className={`text-xl font-heading font-semibold ${night ? "text-white" : "text-gray-800"}`}>🎵 Lullabies & Stories</h2>
          {items.length === 0 && <p className={`py-8 ${night ? "text-gray-400" : "text-gray-400"}`}>No recordings yet. Record some in the Voices section!</p>}
          {items.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`${night ? "glass-dark" : "bg-white shadow-md"} rounded-2xl p-5 flex items-center gap-4`}>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => togglePlay(item.id, item.audio)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-lavender to-purple-400 text-white flex items-center justify-center text-lg flex-shrink-0"
              >
                {playing === item.id ? "⏸" : "▶️"}
              </motion.button>
              <div className="flex-1 text-left">
                <h3 className={`font-heading font-semibold ${night ? "text-white" : "text-gray-800"}`}>{item.title}</h3>
                <p className={`text-xs ${night ? "text-gray-400" : "text-gray-400"}`}>{item.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


