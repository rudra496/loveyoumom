"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecipes, fileToBase64, type Recipe } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";

export default function Recipes() {
  const { items, add } = useRecipes();
  const { t } = useLang();
  const [showForm, setShowForm] = useState(false);
  const [cookMode, setCookMode] = useState<string | null>(null);
  const [cookStep, setCookStep] = useState(0);
  const [form, setForm] = useState<Omit<Recipe, "id">>({ name: "", ingredients: "", instructions: "", photo: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add(form);
    setForm({ name: "", ingredients: "", instructions: "", photo: "" });
    setShowForm(false);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm({ ...form, photo: await fileToBase64(file) });
  };

  const startCooking = (id: string) => { setCookMode(id); setCookStep(0); };
  const recipe = items.find((r) => r.id === cookMode);
  const steps = recipe?.instructions.split("\n").filter(Boolean) || [];

  if (cookMode && recipe) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">🍳 {recipe.name}</h1>
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
          <p className="text-sm text-gray-400 mb-4">{t("step")} {cookStep + 1} {t("of")} {steps.length}</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
            <div className="bg-gradient-to-r from-rose to-gold h-2 rounded-full transition-all" style={{ width: `${((cookStep + 1) / steps.length) * 100}%` }} />
          </div>
          <motion.p
            key={cookStep}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-xl font-heading text-gray-700 mb-8"
          >
            {steps[cookStep]}
          </motion.p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setCookStep(Math.max(0, cookStep - 1))} disabled={cookStep === 0} className="px-6 py-2 rounded-xl bg-gray-100 disabled:opacity-30 font-semibold">← Back</button>
            <button onClick={() => { if (cookStep < steps.length - 1) setCookStep(cookStep + 1); else setCookMode(null); }} className="px-6 py-2 rounded-xl bg-rose text-white font-semibold">
              {cookStep < steps.length - 1 ? "Next →" : "✅ Done!"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold text-gray-800 mb-2">🍲 {t("recipes")}</h1>
        <p className="text-gray-500">Preserve her secret recipes</p>
      </motion.div>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowForm(true)} className="w-full mb-8 py-3 bg-gradient-to-r from-gold to-amber-400 text-white rounded-xl font-semibold shadow-md">
        + {t("addRecipe")}
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-4 overflow-hidden">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:border-gold focus:outline-none" placeholder={t("title")} required />
            <textarea value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:border-gold focus:outline-none h-20 resize-none" placeholder={t("ingredients")} required />
            <textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:border-gold focus:outline-none h-24 resize-none" placeholder={t("instructions")} required />
            <input type="file" accept="image/*" onChange={handlePhoto} className="w-full text-sm" />
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-2 bg-gold text-white rounded-xl font-semibold">{t("save")}</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold">{t("cancel")}</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {items.length === 0 && <p className="text-center text-gray-400 py-12">{t("noRecipes")}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((r) => (
          <div key={r.id} className="flip-card h-72">
            <div className="flip-card-inner relative w-full h-full">
              <div className="flip-card-front absolute inset-0 bg-white rounded-2xl shadow-md overflow-hidden">
                {r.photo ? <img src={r.photo} alt={r.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-gold/20 to-amber-100 flex items-center justify-center text-5xl">🍲</div>}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <h3 className="font-heading font-semibold text-white text-lg">{r.name}</h3>
                </div>
              </div>
              <div className="flip-card-back absolute inset-0 bg-white rounded-2xl shadow-md p-5 overflow-y-auto">
                <h3 className="font-heading font-semibold text-gray-800 text-lg mb-2">{r.name}</h3>
                <p className="text-xs text-gold font-semibold mb-1">{t("ingredients")}</p>
                <p className="text-sm text-gray-600 mb-3">{r.ingredients}</p>
                <p className="text-xs text-gold font-semibold mb-1">{t("instructions")}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{r.instructions}</p>
                <button onClick={() => startCooking(r.id)} className="mt-3 w-full py-2 bg-gradient-to-r from-gold to-amber-400 text-white rounded-xl font-semibold text-sm">
                  {t("cookAlong")} 🍳
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
