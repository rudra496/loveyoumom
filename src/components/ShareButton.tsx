"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";

interface ShareButtonProps {
  cardRef?: React.RefObject<HTMLDivElement | null>;
  title?: string;
  shareText?: string;
}

export default function ShareButton({ cardRef, title = "Love You Mom", shareText }: ShareButtonProps) {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async (platform: string) => {
    const text = shareText || t("shareText");
    const url = window.location.href;

    switch (platform) {
      case "native":
        if (navigator.share) {
          try {
            await navigator.share({ title, text, url });
          } catch { /* user cancelled */ }
        }
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case "copy":
        await navigator.clipboard.writeText(url + "\n" + text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      case "download":
        if (cardRef?.current) {
          const html2canvas = (await import("html2canvas")).default;
          const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null, useCORS: true });
          const link = document.createElement("a");
          link.download = `loveyoumom-${Date.now()}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
        break;
    }
    setOpen(false);
  }, [cardRef, shareText, title, t]);

  const hasNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition ${dark ? "bg-white/10 text-white hover:bg-white/20 border border-white/10" : "bg-gradient-to-r from-rose to-pink-400 text-white shadow-md"}`}
      >
        📤 {t("share")}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute right-0 mt-2 z-50 rounded-xl shadow-xl p-3 min-w-[200px] ${dark ? "bg-[#1a1a2e] border border-white/10" : "bg-white border border-gray-100"}`}
            >
              {hasNativeShare && (
                <button onClick={() => handleShare("native")} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${dark ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-50 text-gray-700"}`}>
                  📱 Native Share
                </button>
              )}
              <button onClick={() => handleShare("whatsapp")} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${dark ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-50 text-gray-700"}`}>
                💬 {t("shareWhatsApp")}
              </button>
              <button onClick={() => handleShare("facebook")} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${dark ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-50 text-gray-700"}`}>
                📘 {t("shareFacebook")}
              </button>
              <button onClick={() => handleShare("twitter")} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${dark ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-50 text-gray-700"}`}>
                🐦 {t("shareTwitter")}
              </button>
              <button onClick={() => handleShare("copy")} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${dark ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-50 text-gray-700"}`}>
                {copied ? "✅ Copied!" : "🔗 " + t("shareCopyLink")}
              </button>
              {cardRef && (
                <button onClick={() => handleShare("download")} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${dark ? "hover:bg-white/10 text-gray-200" : "hover:bg-gray-50 text-gray-700"}`}>
                  📥 {t("shareDownload")}
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
