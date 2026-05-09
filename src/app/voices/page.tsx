"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useVoices } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";

export default function Voices() {
  const { items, add } = useVoices();
  const { t } = useLang();
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          add({ title: title || `Recording ${items.length + 1}`, date: new Date().toISOString().split("T")[0], audio: reader.result as string });
        };
        reader.readAsDataURL(blob);
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
    } catch {
      alert("Microphone access required");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
    setTitle("");
  };

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
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-2">🎵 {t("voices")}</h1>
        <p className="text-gray-500">Keep her voice alive forever</p>
      </motion.div>

      {/* Record section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:border-lavender focus:outline-none mb-4 text-center" placeholder="Name this recording..." />
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={recording ? stopRecording : startRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-lg mx-auto ${recording ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-lavender to-purple-400"}`}
        >
          {recording ? "⏹" : "🎤"}
        </motion.button>
        <p className="text-sm text-gray-400 mt-3">{recording ? t("recording") : t("record")}</p>
      </div>

      {items.length === 0 && <p className="text-center text-gray-400 py-12">{t("noVoices")}</p>}

      <div className="space-y-4">
        {items.map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => togglePlay(item.id, item.audio)}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-lavender to-purple-400 text-white flex items-center justify-center text-lg flex-shrink-0"
            >
              {playing === item.id ? "⏸" : "▶️"}
            </motion.button>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-gray-800 truncate">{item.title}</h3>
              <p className="text-xs text-gray-400">{item.date}</p>
              {playing === item.id && (
                <div className="flex items-end gap-1 mt-2 h-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 bg-lavender rounded-full wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
