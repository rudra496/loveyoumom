"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { fileToBase64, usePhotoBooth } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import DarkStars from "@/components/DarkStars";

const filters = [
  { id: "none", label: "filterNone", css: "" },
  { id: "warm", label: "filterWarm", css: "sepia(0.3) saturate(1.4) brightness(1.1)" },
  { id: "vintage", label: "filterVintage", css: "sepia(0.5) contrast(1.1) brightness(0.9)" },
  { id: "bw", label: "filterBW", css: "grayscale(1) contrast(1.1)" },
  { id: "vibrant", label: "filterVibrant", css: "saturate(1.6) contrast(1.1) brightness(1.05)" },
];

const frames = [
  { id: "none", label: "None", emoji: "❌" },
  { id: "bestmom", label: "frameBestMom", emoji: "👑" },
  { id: "hearts", label: "frameHearts", emoji: "💕" },
  { id: "flowers", label: "frameFlowers", emoji: "🌸" },
];

export default function PhotoBooth() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { items, add } = usePhotoBooth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(filters[0]);
  const [currentFrame, setCurrentFrame] = useState(frames[0]);
  const [flash, setFlash] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      // Camera not available
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((tr) => tr.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  }, []);

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.filter = currentFilter.css;
    ctx.drawImage(video, 0, 0);

    if (currentFrame.id !== "none") {
      ctx.filter = "none";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      if (currentFrame.id === "bestmom") {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillText("👑 BEST MOM 👑", canvas.width / 2, 35);
      } else if (currentFrame.id === "hearts") {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "30px sans-serif";
        ctx.fillText("💕", 30, 35);
        ctx.fillText("💕", canvas.width - 30, 35);
        ctx.fillText("💕", 30, canvas.height - 15);
        ctx.fillText("💕", canvas.width - 30, canvas.height - 15);
      } else if (currentFrame.id === "flowers") {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "28px sans-serif";
        ctx.fillText("🌸", 25, 30);
        ctx.fillText("🌺", canvas.width - 25, 30);
        ctx.fillText("💮", 25, canvas.height - 10);
        ctx.fillText("🏵️", canvas.width - 25, canvas.height - 10);
      }
    }

    setFlash(true);
    setTimeout(() => setFlash(false), 500);
    setCaptured(canvas.toDataURL("image/png"));
  };

  const handleSave = () => {
    if (!captured) return;
    add({ photo: captured, filter: currentFilter.id, date: new Date().toISOString().split("T")[0] });
    setCaptured(null);
  };

  const handleDownload = () => {
    if (!captured) return;
    const link = document.createElement("a");
    link.download = `photobooth-${Date.now()}.png`;
    link.href = captured;
    link.click();
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <canvas ref={canvasRef} className="hidden" />
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">📸</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("boothTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("boothDesc")}</p>
        </motion.div>

        {/* Camera View */}
        <div className={`relative rounded-2xl overflow-hidden mb-6 ${dark ? "bg-white/5" : "bg-black"}`} style={{ minHeight: 300 }}>
          {flash && <div className="absolute inset-0 bg-white z-20 photo-flash" />}

          {!streaming && !captured && (
            <div className="flex items-center justify-center h-[400px]">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="px-8 py-4 bg-gradient-to-r from-rose to-pink-400 text-white rounded-xl font-semibold text-lg shadow-lg">
                📷 {t("startCamera")}
              </motion.button>
            </div>
          )}

          {streaming && !captured && (
            <>
              <video ref={videoRef} autoPlay playsInline muted
                className="w-full rounded-2xl"
                style={{ filter: currentFilter.css, transform: "scaleX(-1)" }} />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                <motion.button whileTap={{ scale: 0.9 }} onClick={capture}
                  className="w-16 h-16 rounded-full bg-white border-4 border-rose shadow-xl flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-rose" />
                </motion.button>
                <button onClick={stopCamera}
                  className={`px-4 py-2 rounded-xl text-sm ${dark ? "bg-white/10 text-white" : "bg-black/50 text-white"}`}>
                  Stop
                </button>
              </div>
            </>
          )}

          {captured && (
            <div className="relative">
              <img src={captured} alt="Captured" className="w-full rounded-2xl" />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave}
                  className="px-5 py-2.5 bg-rose text-white rounded-xl font-semibold shadow-md">
                  💾 {t("saveToGallery")}
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleDownload}
                  className="px-5 py-2.5 bg-gradient-to-r from-lavender to-purple-400 text-white rounded-xl font-semibold shadow-md">
                  📥 {t("downloadPhoto")}
                </motion.button>
                <button onClick={() => setCaptured(null)}
                  className={`px-4 py-2.5 rounded-xl ${dark ? "bg-white/10 text-white" : "bg-white shadow text-gray-700"}`}>
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className={`rounded-2xl p-4 mb-4 ${dark ? "bg-white/5" : "bg-white shadow-sm"}`}>
          <p className={`text-sm font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>Filters</p>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button key={f.id} onClick={() => setCurrentFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${currentFilter.id === f.id ? "bg-rose text-white" : dark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                {t(f.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Frames */}
        <div className={`rounded-2xl p-4 mb-8 ${dark ? "bg-white/5" : "bg-white shadow-sm"}`}>
          <p className={`text-sm font-semibold mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>Frames</p>
          <div className="flex gap-2 flex-wrap">
            {frames.map((f) => (
              <button key={f.id} onClick={() => setCurrentFrame(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${currentFrame.id === f.id ? "bg-rose text-white" : dark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                <span>{f.emoji}</span>
                <span>{f.id === "none" ? "None" : t(f.label)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {items.length > 0 && (
          <div>
            <h3 className={`font-heading font-bold text-lg mb-4 ${dark ? "text-white" : "text-gray-800"}`}>📸 Booth Gallery</h3>
            <div className="grid grid-cols-3 gap-3">
              {items.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl overflow-hidden shadow-md">
                  <img src={item.photo} alt="" className="w-full aspect-square object-cover" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
