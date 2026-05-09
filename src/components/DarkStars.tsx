"use client";

import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useDarkMode } from "@/lib/store";

export default function DarkStars() {
  const { dark } = useDarkMode();
  const stars = useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${1.5 + Math.random() * 2.5}s`,
    size: `${1 + Math.random() * 2.5}px`,
  })), []);

  if (!dark) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s) => (
        <div key={s.id} className="dark-star absolute rounded-full bg-white" style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration }} />
      ))}
    </div>
  );
}
