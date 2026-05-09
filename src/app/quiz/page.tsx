"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import Confetti from "@/components/Confetti";
import DarkStars from "@/components/DarkStars";
import ShareButton from "@/components/ShareButton";

type ScoreLevel = "exact" | "close" | "partial" | "effort" | "none";

function normalizeText(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s: string) {
  const n = normalizeText(s);
  return n ? n.split(" ").filter(Boolean) : [];
}

function jaccard(a: string[], b: string[]) {
  const sa = new Set(a);
  const sb = new Set(b);
  const inter = [...sa].filter((x) => sb.has(x)).length;
  const uni = new Set([...sa, ...sb]).size || 1;
  return inter / uni;
}

function scoreAnswer(userAnswer: string, momAnswer: string): { points: number; level: ScoreLevel } {
  const u = normalizeText(userAnswer);
  const m = normalizeText(momAnswer);
  if (!u || !m) return { points: 0, level: "none" };
  if (u === m) return { points: 2, level: "exact" };

  const variants = Array.from(
    new Set(
      [m, ...m.split(/[|/]/g), ...m.replace(/[()]/g, " ").split(/[;,]/g)]
        .map((v) => normalizeText(v))
        .filter(Boolean),
    ),
  );

  const uTokens = tokens(u);
  const best = variants.reduce((acc, v) => {
    const vTokens = tokens(v);
    let sim = jaccard(uTokens, vTokens);
    if (v.includes(u) || u.includes(v)) sim = Math.max(sim, 0.75);
    return Math.max(acc, sim);
  }, 0);

  if (best >= 0.6) return { points: 1.5, level: "close" };
  if (best >= 0.35) return { points: 1, level: "partial" };
  return { points: 0.5, level: "effort" };
}

export default function Quiz() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { items, update, add } = useQuiz();
  const { fire: fireConfetti } = Confetti();
  const [currentQ, setCurrentQ] = useState(0);
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [customQ, setCustomQ] = useState("");
  const [customA, setCustomA] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [loveNote, setLoveNote] = useState("");
  const resultCardRef = useRef<HTMLDivElement>(null);

  // Local answer tracking — doesn't depend on async IndexedDB
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finalItems, setFinalItems] = useState<typeof items>([]);

  const handleAnswer = useCallback((id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleNext = () => {
    if (currentQ < items.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate score from local answers
      const scored = items.map((q) => ({
        ...q,
        userAnswer: answers[q.id] || "",
      }));
      setFinalItems(scored);
      setShowResults(true);
      const maxPoints = scored.length * 2 || 1;
      const points = scored.reduce((acc, q) => acc + scoreAnswer(q.userAnswer, q.momAnswer).points, 0);
      if (points / maxPoints >= 0.75) fireConfetti();
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentQ(0);
    setShowResults(false);
    setStarted(false);
    setFinalItems([]);
  };

  const addCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQ.trim() || !customA.trim()) return;
    add({ question: customQ, userAnswer: "", momAnswer: customA });
    setCustomQ("");
    setCustomA("");
    setShowCustom(false);
  };

  const scoreDetails = useMemo(() => {
    if (!showResults) return { points: 0, maxPoints: 0, pct: 0, matches: 0 };
    const maxPoints = finalItems.length * 2;
    const scored = finalItems.map((q) => scoreAnswer(q.userAnswer, q.momAnswer));
    const points = scored.reduce((acc, s) => acc + s.points, 0);
    const matches = scored.filter((s) => s.level === "exact" || s.level === "close").length;
    const pct = maxPoints ? points / maxPoints : 0;
    return { points, maxPoints, pct, matches };
  }, [finalItems, showResults]);

  const getAnswerMark = (q: typeof items[0]) => {
    const { level } = scoreAnswer(q.userAnswer, q.momAnswer);
    if (level === "exact") return "✅";
    if (level === "close") return "🟡";
    if (level === "partial") return "➖";
    if (level === "effort") return "💗";
    return "—";
  };

  const getScoreMessage = () => {
    const pct = scoreDetails.pct;
    if (pct >= 0.9) return { emoji: "🏆", msg: t("quizMsgPerfect") || "Perfect match! You know her like home. Now go tell her you love her." };
    if (pct >= 0.75) return { emoji: "🌟", msg: t("quizMsgGreat") || "So good! Your love shows in the details. Send her a sweet message today." };
    if (pct >= 0.6) return { emoji: "😊", msg: t("quizMsgGood") || "Lovely! You know a lot — and the rest is a chance to make new memories together." };
    if (pct >= 0.4) return { emoji: "🤍", msg: t("quizMsgOk") || "Good start! Ask her these questions and listen to the stories behind them." };
    return { emoji: "💗", msg: t("quizMsgLove") || "No worries — love is the real score. Go hug Mom and learn one new thing about her." };
  };

  const question = items[currentQ];
  const currentAnswer = question ? (answers[question.id] || "") : "";

  if (!question && items.length === 0) {
    return (
      <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
        <div className="text-center">
          <div className="text-5xl mb-4">🧠</div>
          <p className={dark ? "text-gray-300" : "text-gray-600"}>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🧠</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("quizTitle") || "How Well Do You Know Your Mom?"}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("quizDesc") || "Answer questions about your mom and see how well you know her!"}</p>
        </motion.div>

        {!started ? (
          <div className="text-center">
            <p className={`mb-6 ${dark ? "text-gray-300" : "text-gray-600"}`}>{items.length} questions ready</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setStarted(true)} className="px-8 py-4 bg-gradient-to-r from-lavender to-purple-400 text-white rounded-full font-semibold shadow-lg text-lg">
              {t("startQuiz") || "Start Quiz"} 🚀
            </motion.button>
            <div className="mt-8">
              <button onClick={() => setShowSetup(!showSetup)} className={`text-sm ${dark ? "text-rose-light" : "text-rose"}`}>{t("quizSetup") || "Customize Mom's Answers"}</button>
              <AnimatePresence>
                {showSetup && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`mt-4 rounded-2xl p-4 overflow-hidden ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
                    <p className={`text-sm mb-3 ${dark ? "text-gray-300" : "text-gray-600"}`}>{t("quizSetupDesc") || "Set the answer key so the scoring matches your mom."}</p>
                    <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
                      {items.map((q) => (
                        <div key={q.id} className="text-left">
                          <p className={`text-xs mb-1 ${dark ? "text-gray-200" : "text-gray-700"}`}>{q.question}</p>
                          <input
                            type="text"
                            value={q.momAnswer || ""}
                            onChange={(e) => update(q.id, { momAnswer: e.target.value })}
                            className={`w-full p-2 rounded-xl border focus:outline-none text-sm ${dark ? "bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-lavender" : "border-gray-200 focus:border-lavender"}`}
                            placeholder={t("momsAnswer") || "Mom's answer..."}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={() => setShowCustom(!showCustom)} className={`text-sm ${dark ? "text-rose-light" : "text-rose"}`}>+ {t("customQuestion") || "Add Custom Question"}</button>
              <AnimatePresence>
                {showCustom && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={addCustomQuestion} className={`mt-4 rounded-2xl p-4 space-y-3 overflow-hidden ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
                    <input type="text" value={customQ} onChange={(e) => setCustomQ(e.target.value)} className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-lavender"}`} placeholder="Your question..." required />
                    <input type="text" value={customA} onChange={(e) => setCustomA(e.target.value)} className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-lavender"}`} placeholder="Mom's answer..." required />
                    <button type="submit" className="w-full py-2 bg-lavender text-white rounded-xl font-semibold">{t("save") || "Save"}</button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : showResults ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div ref={resultCardRef} className={`rounded-2xl p-6 ${dark ? "bg-white/5" : "bg-white shadow-lg"}`}>
              <div className="text-6xl mb-4">{getScoreMessage().emoji}</div>
              <h2 className={`text-3xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("score") || "Your Score"}</h2>
              <div className="text-5xl font-heading font-bold mb-2 text-gold">
                {scoreDetails.points.toFixed(1)}/{scoreDetails.maxPoints}
              </div>
              <p className={`text-sm mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {t("quizMatches") || "Close/Exact matches"}: {scoreDetails.matches}/{finalItems.length} · {Math.round(scoreDetails.pct * 100)}%
              </p>
              <p className={`text-lg mb-6 ${dark ? "text-gray-300" : "text-gray-600"}`}>{getScoreMessage().msg}</p>

              <div className="grid gap-3 mb-6">
                <div className="text-left">
                  <p className={`text-sm font-semibold mb-2 ${dark ? "text-gray-200" : "text-gray-700"}`}>{t("quizLoveNote") || "Write a note to Mom"}</p>
                  <textarea
                    value={loveNote}
                    onChange={(e) => setLoveNote(e.target.value)}
                    rows={3}
                    className={`w-full p-3 rounded-xl border focus:outline-none text-sm ${dark ? "bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-lavender" : "border-gray-200 focus:border-lavender"}`}
                    placeholder={t("quizLoveNotePlaceholder") || "One line that will make her smile..."}
                  />
                </div>
              </div>

              <div className={`rounded-2xl p-4 ${dark ? "bg-black/10" : "bg-cream"}`}>
                {finalItems.map((q, i) => (
                  <div key={q.id} className={`flex items-start gap-3 py-3 ${i < finalItems.length - 1 ? "border-b border-gray-100/40" : ""}`}>
                    <span className="text-lg">{getAnswerMark(q)}</span>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-700"}`}>{q.question}</p>
                      <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>You: {q.userAnswer || "—"} | Mom: {q.momAnswer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mt-6">
              <ShareButton
                cardRef={resultCardRef}
                title={t("quizShareTitle") || "Mom-ometer Result"}
                shareText={[
                  `${t("quizShareLine1") || "I just took the Mom-ometer quiz!"} ${Math.round(scoreDetails.pct * 100)}% 💗`,
                  loveNote ? `"${loveNote}"` : "",
                  t("quizShareLine2") || "No matter the score — call your mom today.",
                  "#LoveYouMom #BuiltWithTRAE",
                ].filter(Boolean).join("\n")}
              />
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={resetQuiz} className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${dark ? "bg-white/10 text-white hover:bg-white/20 border border-white/10" : "bg-gradient-to-r from-lavender to-purple-400 text-white shadow-md"}`}>
                Play Again 🔄
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Progress */}
            <div className="flex justify-between items-center mb-4">
              <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{currentQ + 1} / {items.length}</span>
              <div className="w-48 bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-lavender to-purple-400 h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / items.length) * 100}%` }} />
              </div>
            </div>

            {/* Question */}
            <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`rounded-2xl p-8 mb-6 text-center ${dark ? "bg-white/5" : "bg-white shadow-lg"}`}>
              <div className="text-3xl mb-4">💭</div>
              <h3 className={`text-xl font-heading font-semibold mb-6 ${dark ? "text-white" : "text-gray-800"}`}>{question.question}</h3>
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                className={`w-full p-4 rounded-xl border text-center text-lg focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-lavender" : "border-gray-200 focus:border-lavender"}`}
                placeholder={t("yourAnswer") || "Type your answer..."}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              disabled={!currentAnswer.trim()}
              className="w-full py-3 bg-gradient-to-r from-lavender to-purple-400 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
            >
              {currentQ < items.length - 1 ? `${t("nextQuestion") || "Next"} →` : t("submitQuiz") || "See Results"}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
