"use client";

import { motion } from "framer-motion";
import { useDarkMode } from "@/lib/store";

export default function Heart3D() {
  const { dark } = useDarkMode();

  return (
    <div className="relative w-32 h-32 mx-auto mb-6" style={{ perspective: "600px" }}>
      <motion.div
        animate={{
          rotateY: [0, 360],
          scale: [1, 1.08, 1],
        }}
        transition={{
          rotateY: { repeat: Infinity, duration: 6, ease: "linear" },
          scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full relative"
      >
        {/* CSS Heart shape */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="heart-3d-shape"
            style={{
              filter: `drop-shadow(0 0 20px ${dark ? "rgba(244,63,94,0.6)" : "rgba(244,63,94,0.4)"}) drop-shadow(0 0 40px ${dark ? "rgba(167,139,250,0.3)" : "rgba(252,211,77,0.2)"})`,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-28 h-28">
              <defs>
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F43F5E" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
                <filter id="heartGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M50 88 C25 65 5 50 5 33 C5 17 17 5 33 5 C41 5 47 9 50 16 C53 9 59 5 67 5 C83 5 95 17 95 33 C95 50 75 65 50 88Z"
                fill="url(#heartGrad)"
                filter="url(#heartGlow)"
              />
              {/* Shine effect */}
              <ellipse cx="35" cy="30" rx="12" ry="8" fill="white" opacity="0.25" transform="rotate(-20 35 30)" />
            </svg>
          </div>
        </div>

        {/* Floating sparkle particles */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="absolute text-sm"
            style={{
              left: `${20 + (i * 12) % 60}%`,
              top: `${10 + (i * 17) % 70}%`,
            }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            {["✨", "💫", "⭐", "🌟", "✨", "💫"][i]}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
