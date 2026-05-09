"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import Confetti from "@/components/Confetti";
import DarkStars from "@/components/DarkStars";

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
      const correct = scored.filter((q) => q.userAnswer && q.momAnswer && q.userAnswer.toLowerCase().trim() === q.momAnswer.toLowerCase().trim()).length;
      if (correct / scored.length >= 0.7) fireConfetti();
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

  // Score from finalItems when showing results
  const score = showResults
    ? finalItems.filter((q) => q.userAnswer && q.momAnswer && q.userAnswer.toLowerCase().trim() === q.momAnswer.toLowerCase().trim()).length
    : 0;

  const isCorrect = (q: typeof items[0]) =>
    q.userAnswer && q.momAnswer && q.userAnswer.toLowerCase().trim() === q.momAnswer.toLowerCase().trim();

  const getScoreMessage = () => {
    const total = finalItems.length || 1;
    const pct = score / total;
    if (pct >= 1) return { emoji: "🏆", msg: "PERFECT! You know Mom perfectly!" };
    if (pct >= 0.8) return { emoji: "🌟", msg: "Amazing! You really know her well!" };
    if (pct >= 0.6) return { emoji: "😊", msg: "Good job! But there's more to learn!" };
    if (pct >= 0.4) return { emoji: "🤔", msg: "Not bad! Time to get to know her better!" };
    return { emoji: "😅", msg: "Looks like you need to spend more time with Mom!" };
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
            <div className="text-6xl mb-4">{getScoreMessage().emoji}</div>
            <h2 className={`text-3xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("score") || "Your Score"}</h2>
            <div className="text-5xl font-heading font-bold mb-2 text-gold">{score}/{finalItems.length}</div>
            <p className={`text-lg mb-8 ${dark ? "text-gray-300" : "text-gray-600"}`}>{getScoreMessage().msg}</p>

            {/* Score card */}
            <div className={`rounded-2xl p-6 mb-8 ${dark ? "bg-white/5" : "bg-white shadow-lg"}`}>
              {finalItems.map((q, i) => (
                <div key={q.id} className={`flex items-start gap-3 py-3 ${i < finalItems.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <span className="text-lg">{isCorrect(q) ? "✅" : "❌"}</span>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-700"}`}>{q.question}</p>
                    <p className="text-xs text-gray-400">You: {q.userAnswer || "—"} | Mom: {q.momAnswer}</p>
                  </div>
                </div>
              ))}
            </div>

            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={resetQuiz} className="px-8 py-3 bg-gradient-to-r from-lavender to-purple-400 text-white rounded-full font-semibold shadow-md">
              Play Again 🔄
            </motion.button>
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
