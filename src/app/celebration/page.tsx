"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useCelebration } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import Confetti from "@/components/Confetti";
import DarkStars from "@/components/DarkStars";

export default function Celebration() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { config, setConfig } = useCelebration();
  const { fire: fireConfetti } = Confetti();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [celebrating, setCelebrating] = useState(false);
  const [activeTab, setActiveTab] = useState<"mothersDay" | "birthday">("mothersDay");
  const [editing, setEditing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetDate = activeTab === "mothersDay" ? config.motherDayDate : config.birthdayDate;
  const title = activeTab === "mothersDay" ? t("mothersDay") : t("birthday");
  const celebrationMsg = activeTab === "mothersDay" ? t("happyMothersDay") : `${t("happyBirthday")} ${config.name}!`;

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate + "T00:00:00").getTime();
      const diff = target - now;
      if (diff <= 0) {
        if (!celebrating) {
          setCelebrating(true);
          fireConfetti();
        }
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setCelebrating(false);
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate, celebrating, fireConfetti]);

  // Canvas confetti
  useEffect(() => {
    if (!celebrating || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; color: string; rot: number; vr: number }> = [];
    const colors = ["#F43F5E", "#A78BFA", "#F59E0B", "#FDA4AF", "#C4B5FD", "#FCD34D", "#EC4899"];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
      });
    }
    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vy += 0.05;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; p.vy = Math.random() * 3 + 2; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [celebrating]);

  const saveConfig = (field: string, value: string) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 relative ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      {celebrating && <canvas ref={canvasRef} className="fixed inset-0 z-40 pointer-events-none" />}
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("celebrationTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("celebrationDesc")}</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 justify-center">
          <button onClick={() => { setActiveTab("mothersDay"); setCelebrating(false); }} className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === "mothersDay" ? "bg-rose text-white" : (dark ? "bg-white/10 text-gray-300" : "bg-rose/10 text-rose")}`}>
            {t("mothersDay")}
          </button>
          <button onClick={() => { setActiveTab("birthday"); setCelebrating(false); }} className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === "birthday" ? "bg-gold text-white" : (dark ? "bg-white/10 text-gray-300" : "bg-gold/10 text-gold")}`}>
            {t("birthday")}
          </button>
        </div>

        {/* Config */}
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setEditing(!editing)} className={`text-sm font-medium mb-4 block ${dark ? "text-rose-light" : "text-rose"}`}>
          ⚙️ {t("configure")}
        </motion.button>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`rounded-2xl p-4 mb-8 space-y-3 ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
            <input type="text" value={config.name} onChange={(e) => saveConfig("name", e.target.value)} className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200"}`} placeholder={t("momName")} />
            <input type="date" value={config.motherDayDate} onChange={(e) => saveConfig("motherDayDate", e.target.value)} className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200"}`} />
            <input type="date" value={config.birthdayDate} onChange={(e) => saveConfig("birthdayDate", e.target.value)} className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200"}`} />
          </motion.div>
        )}

        {/* Countdown or Celebration */}
        {celebrating ? (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="text-8xl mb-6">🎊</motion.div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-rose via-lavender to-gold bg-clip-text text-transparent mb-4">
              {celebrationMsg}
            </h2>
            <p className={`text-xl ${dark ? "text-gray-300" : "text-gray-600"}`}>Today is the day to celebrate! 🎉</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fireConfetti} className="mt-8 px-8 py-3 bg-gradient-to-r from-rose to-gold text-white rounded-full font-semibold shadow-lg">
              🎆 More Confetti!
            </motion.button>
          </motion.div>
        ) : (
          <div className="text-center">
            <h2 className={`text-2xl font-heading font-semibold mb-8 ${dark ? "text-white" : "text-gray-800"}`}>
              {title} Countdown 🗓️
            </h2>
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {[
                { value: timeLeft.days, label: t("daysLeft") },
                { value: timeLeft.hours, label: t("hoursLeft") },
                { value: timeLeft.minutes, label: t("minutesLeft") },
                { value: timeLeft.seconds, label: t("secondsLeft") },
              ].map((unit, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`rounded-2xl p-4 ${dark ? "bg-white/5 border border-white/10" : "bg-white shadow-lg"}`}>
                  <div className={`text-3xl md:text-4xl font-heading font-bold ${dark ? "text-gold" : "text-rose"}`}>{String(unit.value).padStart(2, "0")}</div>
                  <div className={`text-xs mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>{unit.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
