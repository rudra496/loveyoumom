"use client";

import { useCallback } from "react";

export default function Confetti() {
  const fire = useCallback(() => {
    const colors = ["#F43F5E", "#A78BFA", "#F59E0B", "#FDA4AF", "#C4B5FD", "#FCD34D", "#EC4899", "#8B5CF6"];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.left = `${Math.random() * 100}vw`;
      el.style.width = `${6 + Math.random() * 8}px`;
      el.style.height = `${6 + Math.random() * 8}px`;
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      el.style.animationDuration = `${2 + Math.random() * 3}s`;
      el.style.animationDelay = `${Math.random() * 0.5}s`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }
  }, []);

  return { fire };
}
