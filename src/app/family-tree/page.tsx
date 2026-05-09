"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFamily } from "@/lib/store";
import { useLang } from "@/lib/LanguageContext";
import { useDarkMode } from "@/lib/store";
import { fileToBase64 } from "@/lib/store";
import DarkStars from "@/components/DarkStars";

export default function FamilyTree() {
  const { t } = useLang();
  const { dark } = useDarkMode();
  const { items, add, remove } = useFamily();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", relation: "", photo: "", birthYear: "", parentId: "" as string | null });

  const roots = items.filter((m) => !m.parentId);
  const getChildren = (pid: string) => items.filter((m) => m.parentId === pid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    add({ ...form, parentId: form.parentId || null });
    setForm({ name: "", relation: "", photo: "", birthYear: "", parentId: "" });
    setShowForm(false);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm({ ...form, photo: await fileToBase64(file) });
  };

  const renderMember = (member: typeof items[0]) => {
    const children = getChildren(member.id);
    return (
      <div key={member.id} className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className={`relative rounded-2xl p-4 text-center min-w-[140px] ${dark ? "bg-white/5 border border-white/10" : "bg-white shadow-lg border border-rose/20"}`}
        >
          <button onClick={() => remove(member.id)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600">✕</button>
          <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden flex items-center justify-center bg-gradient-to-br from-rose/20 to-lavender/20">
            {member.photo ? <img src={member.photo} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl">👤</span>}
          </div>
          <p className={`font-heading font-semibold text-sm ${dark ? "text-white" : "text-gray-800"}`}>{member.name}</p>
          <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{member.relation}</p>
          {member.birthYear && <p className="text-xs text-gray-400">b. {member.birthYear}</p>}
        </motion.div>
        {children.length > 0 && (
          <>
            <div className={`w-0.5 h-6 ${dark ? "bg-white/20" : "bg-gradient-to-b from-rose/30 to-lavender/30"}`} />
            <div className={`flex gap-6 ${dark ? "before:bg-white/20" : ""} relative`}>
              {children.length > 1 && (
                <div className={`absolute top-0 h-0.5 ${dark ? "bg-white/20" : "bg-gradient-to-r from-rose/30 to-lavender/30"}`}
                  style={{ left: `calc(50% - ${(children.length - 1) * 1.5}rem - 2.5rem)`, width: `${(children.length - 1) * 6}rem` }}
                />
              )}
              {children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className={`w-0.5 h-6 ${dark ? "bg-white/20" : "bg-gradient-to-b from-rose/30 to-lavender/30"}`} />
                  {renderMember(child)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${dark ? "bg-[#0f0d1a]" : "bg-cream"}`}>
      <DarkStars />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🌳</div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${dark ? "text-white" : "text-gray-800"}`}>{t("familyTreeTitle")}</h1>
          <p className={dark ? "text-gray-400" : "text-gray-500"}>{t("familyTreeDesc")}</p>
        </motion.div>

        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowForm(true)} className="w-full mb-8 py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl font-semibold shadow-md">
          + {t("addMember")}
        </motion.button>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className={`rounded-2xl p-6 mb-8 space-y-4 overflow-hidden ${dark ? "bg-white/5" : "bg-white shadow-md"}`}>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`} placeholder={t("name")} required />
              <input type="text" value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`} placeholder={t("relation")} required />
              <input type="number" value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: e.target.value })} className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`} placeholder={t("birthYear")} />
              <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} className={`w-full p-3 rounded-xl border focus:outline-none ${dark ? "bg-white/5 border-white/10 text-gray-200" : "border-gray-200 focus:border-rose"}`}>
                <option value="">No parent (root)</option>
                {items.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>)}
              </select>
              <input type="file" accept="image/*" onChange={handlePhoto} className="w-full text-sm" />
              {form.photo && <img src={form.photo} alt="" className="w-20 h-20 rounded-full object-cover mx-auto" />}
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2 bg-green-500 text-white rounded-xl font-semibold">{t("save")}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold">{t("cancel")}</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Tree */}
        <div className="overflow-x-auto pb-8">
          <div className="flex flex-col items-center min-w-max py-8">
            {roots.length === 0 ? (
              <p className={`text-center py-12 ${dark ? "text-gray-600" : "text-gray-400"}`}>No family members yet. Add someone!</p>
            ) : (
              roots.map((root) => renderMember(root))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
