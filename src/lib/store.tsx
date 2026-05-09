"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { dbGet, dbPut, StoreName, migrateFromLocalStorage } from "./db";

export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  photo?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
  photo?: string;
}

export interface VoiceRecording {
  id: string;
  title: string;
  date: string;
  audio: string;
}

export interface WisdomItem {
  id: string;
  text: string;
  author?: string;
  gradient: string;
}

export interface GalleryPhoto {
  id: string;
  photo: string;
  date: string;
  mood: string;
  caption?: string;
}

export interface LoveLetter {
  id: string;
  content: string;
  template: string;
  date: string;
  fontFamily: string;
}

export interface GratitudeEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  userAnswer: string;
  momAnswer: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  photo: string;
  birthYear: string;
  parentId: string | null;
}

export interface PromiseItem {
  id: string;
  text: string;
  kept: boolean;
  dateCreated: string;
  dateKept: string | null;
}

export interface CelebrationConfig {
  motherDayDate: string;
  birthdayDate: string;
  name: string;
}

export interface CollageItem {
  id: string;
  title: string;
  photos: string[];
  layout: string;
  bgGradient: string;
  date: string;
}

export interface CouponItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  redeemed: boolean;
  dateRedeemed: string | null;
}

export interface BucketListItem {
  id: string;
  text: string;
  category: string;
  completed: boolean;
  photo?: string;
}

export interface GiftItem {
  id: string;
  type: "text" | "photo" | "coupon";
  content: string;
  opened: boolean;
}

export interface JarNote {
  id: string;
  text: string;
  color: string;
  date: string;
}

export interface BoothPhoto {
  id: string;
  photo: string;
  filter: string;
  date: string;
}

export interface DarkModeContextType {
  dark: boolean;
  toggleDark: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({ dark: false, toggleDark: () => {} });
export const useDarkMode = () => useContext(DarkModeContext);
export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const toggleDark = () => setDark(d => !d);
  return <DarkModeContext.Provider value={{ dark, toggleDark }}>{children}</DarkModeContext.Provider>;
}

const GRADIENTS = [
  "from-rose to-pink-300",
  "from-lavender to-purple-300",
  "from-gold to-amber-300",
  "from-rose to-lavender",
  "from-gold to-rose",
  "from-lavender to-blue-300",
];

export function getGradient(i: number) {
  return GRADIENTS[i % GRADIENTS.length];
}

// Seed data
const seedMemories: Memory[] = [
  { id: "s1", date: "1990-05-15", title: "The Day You Were Born", description: "The most beautiful day of my life. Holding you for the first time changed everything.", photo: "" },
  { id: "s2", date: "2005-09-01", title: "First Day of School", description: "You were so brave! I cried more than you did watching you walk through those gates.", photo: "" },
  { id: "s3", date: "2020-12-25", title: "Cooking Together", description: "We made her famous biryani. The kitchen was a mess but the food was perfect.", photo: "" },
];

const seedRecipes: Recipe[] = [
  { id: "r1", name: "Mom's Special Biryani", ingredients: "Rice, Chicken, Yogurt, Spices, Saffron, Ghee", instructions: "1. Marinate chicken overnight\n2. Cook rice until 70% done\n3. Layer rice and chicken\n4. Add saffron milk\n5. Steam on low heat (dum) for 30 min", photo: "" },
  { id: "r2", name: "Grandma's Halwa", ingredients: "Semolina, Ghee, Sugar, Milk, Cardamom, Nuts", instructions: "1. Roast semolina in ghee until golden\n2. Add milk and sugar\n3. Stir continuously\n4. Garnish with nuts\n5. Serve warm", photo: "" },
];

const seedWisdom: WisdomItem[] = [
  { id: "w1", text: "Be kind. Everyone you meet is fighting a battle you know nothing about.", author: "Mom", gradient: GRADIENTS[0] },
  { id: "w2", text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Mom", gradient: GRADIENTS[1] },
  { id: "w3", text: "Home is not a place, it's a feeling — and that feeling is love.", author: "Mom", gradient: GRADIENTS[2] },
];

const seedGratitude: GratitudeEntry[] = [
  { id: "gs1", date: "2026-05-08", content: "Thank you for always believing in me, even when I didn't believe in myself.", mood: "❤️ Love" },
  { id: "gs2", date: "2026-05-09", content: "I'm grateful for the warm meals you cook — they taste like home.", mood: "😊 Happy" },
  { id: "gs3", date: "2026-05-07", content: "Your hugs fix everything. I'm grateful for every single one.", mood: "🌸 Peaceful" },
];

const seedPromises: PromiseItem[] = [
  { id: "ps1", text: "I'll call you every single day", kept: true, dateCreated: "2026-05-01", dateKept: "2026-05-02" },
  { id: "ps2", text: "I'll cook your favorite biryani for you", kept: false, dateCreated: "2026-05-03", dateKept: null },
  { id: "ps3", text: "I'll never forget your lessons", kept: true, dateCreated: "2026-05-01", dateKept: "2026-05-01" },
  { id: "ps4", text: "I'll take you on that trip you always wanted", kept: false, dateCreated: "2026-05-05", dateKept: null },
];

const seedFamily: FamilyMember[] = [
  { id: "fm1", name: "Dadi (Grandma)", relation: "Grandmother", photo: "", birthYear: "1945", parentId: null },
  { id: "fm2", name: "Mom", relation: "Mother", photo: "", birthYear: "1970", parentId: "fm1" },
  { id: "fm3", name: "Me", relation: "Child", photo: "", birthYear: "2000", parentId: "fm2" },
  { id: "fm4", name: "Dad", relation: "Father", photo: "", birthYear: "1968", parentId: null },
];

const seedQuiz: QuizQuestion[] = [
  { id: "q1", question: "What is Mom's favorite color?", userAnswer: "", momAnswer: "Red" },
  { id: "q2", question: "What is Mom's favorite food?", userAnswer: "", momAnswer: "Biryani" },
  { id: "q3", question: "What song does Mom love the most?", userAnswer: "", momAnswer: "Lata Mangeshkar songs" },
  { id: "q4", question: "What is Mom's favorite flower?", userAnswer: "", momAnswer: "Jasmine (Beli)" },
  { id: "q5", question: "What is Mom's favorite season?", userAnswer: "", momAnswer: "Spring" },
  { id: "q6", question: "What was Mom's childhood dream?", userAnswer: "", momAnswer: "To be a teacher" },
  { id: "q7", question: "What is Mom's go-to comfort movie?", userAnswer: "", momAnswer: "Mother India" },
  { id: "q8", question: "What is Mom's favorite hobby?", userAnswer: "", momAnswer: "Gardening" },
  { id: "q9", question: "What is the first thing Mom does every morning?", userAnswer: "", momAnswer: "Prays and makes tea" },
  { id: "q10", question: "What is Mom's most-used phrase?", userAnswer: "", momAnswer: "Eat well, study hard" },
];

const seedLoveLetters: LoveLetter[] = [
  { id: "ls1", content: "Dear Mom,\n\nNo words can express how much you mean to me. You are my first teacher, my best friend, and my greatest inspiration. Every sacrifice you made has shaped who I am today.\n\nI love you more than words can say.\n\nForever yours ❤️", template: "For My Mother", date: "2026-05-08", fontFamily: "Dancing Script" },
];

const seedCelebration: CelebrationConfig = {
  motherDayDate: "2026-05-10",
  birthdayDate: "1970-08-15",
  name: "Mom",
};

const seedCoupons: CouponItem[] = [
  { id: "co1", title: "Breakfast in Bed", description: "One complete breakfast served in bed, any morning of your choice!", icon: "🍳", redeemed: false, dateRedeemed: null },
  { id: "co2", title: "One Big Hug", description: "Redeemable for one extra-long, extra-warm hug. No expiration!", icon: "🤗", redeemed: false, dateRedeemed: null },
  { id: "co3", title: "Day Off From Chores", description: "You relax while I handle everything for the entire day!", icon: "🧹", redeemed: false, dateRedeemed: null },
  { id: "co4", title: "Movie Night", description: "Your choice of movie, snacks provided, no complaints allowed!", icon: "🎬", redeemed: false, dateRedeemed: null },
  { id: "co5", title: "Foot Massage", description: "A 15-minute foot massage redeemable anytime!", icon: "💆", redeemed: false, dateRedeemed: null },
  { id: "co6", title: "Home-Cooked Dinner", description: "I will cook your favorite meal from scratch!", icon: "🍽️", redeemed: false, dateRedeemed: null },
  { id: "co7", title: "Shopping Trip", description: "One shopping trip with me as your personal assistant!", icon: "🛍️", redeemed: false, dateRedeemed: null },
  { id: "co8", title: "Unconditional Love", description: "Always valid, never expires. My love for you is forever!", icon: "❤️", redeemed: false, dateRedeemed: null },
];

const seedBucketList: BucketListItem[] = [
  { id: "bl1", text: "Cook a meal together from scratch", category: "Food", completed: false },
  { id: "bl2", text: "Take a road trip to a new place", category: "Adventures", completed: false },
  { id: "bl3", text: "Learn her secret family recipe", category: "Learning", completed: false },
  { id: "bl4", text: "Watch the sunrise together", category: "Quality Time", completed: false },
  { id: "bl5", text: "Have a proper tea/coffee date", category: "Quality Time", completed: false },
  { id: "bl6", text: "Visit her childhood home or neighborhood", category: "Adventures", completed: false },
  { id: "bl7", text: "Write her a heartfelt letter", category: "Quality Time", completed: true },
  { id: "bl8", text: "Take professional photos together", category: "Quality Time", completed: false },
  { id: "bl9", text: "Learn to make her signature dish", category: "Food", completed: false },
  { id: "bl10", text: "Plan a surprise birthday party", category: "Adventures", completed: false },
];

const seedJarNotes: JarNote[] = [
  { id: "jn1", text: "Thank you for every warm meal that felt like a hug", color: "from-rose to-pink-300", date: "2026-05-01" },
  { id: "jn2", text: "Your laughter is the most beautiful sound in the world", color: "from-lavender to-purple-300", date: "2026-05-02" },
  { id: "jn3", text: "I remember when you stayed up all night when I was sick", color: "from-gold to-amber-300", date: "2026-05-03" },
  { id: "jn4", text: "Your strength inspires me to never give up", color: "from-rose to-lavender", date: "2026-05-04" },
  { id: "jn5", text: "The way you make any house feel like home is pure magic", color: "from-gold to-rose", date: "2026-05-05" },
];

// Migration state
let migrationChecked = false;
let migrationToast: ((msg: string) => void) | null = null;

export function setMigrationToast(fn: (msg: string) => void) {
  migrationToast = fn;
}

function useIndexedDB<T>(store: StoreName, fallback: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [data, setData] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    async function load() {
      // Run migration once
      if (!migrationChecked) {
        migrationChecked = true;
        try {
          const migrated = await migrateFromLocalStorage();
          if (migrated && migrationToast) {
            migrationToast("Data migrated to improved storage ✓");
          }
        } catch { /* ignore */ }
      }

      try {
        const stored = await dbGet<T>(store);
        if (!cancelled && stored !== undefined) {
          setData(stored);
        }
      } catch { /* use fallback */ }
      if (!cancelled) setLoaded(true);
    }

    load();
    return () => { cancelled = true; };
  }, [store]);

  const update: React.Dispatch<React.SetStateAction<T>> = useCallback((val) => {
    setData((prev) => {
      const next = typeof val === "function" ? (val as (p: T) => T)(prev) : val;
      if (loaded && typeof window !== "undefined") {
        dbPut(store, next).catch(() => {});
      }
      return next;
    });
  }, [store, loaded]);

  return [data, update];
}

// Hooks
export function useMemories() {
  const [items, setItems] = useIndexedDB<Memory[]>("memories", seedMemories);
  return { items, setItems, add: (m: Omit<Memory, "id">) => { const n = { ...m, id: "m" + Date.now() }; setItems([...items, n]); } };
}

export function useRecipes() {
  const [items, setItems] = useIndexedDB<Recipe[]>("recipes", seedRecipes);
  return { items, setItems, add: (r: Omit<Recipe, "id">) => { const n = { ...r, id: "r" + Date.now() }; setItems([...items, n]); } };
}

export function useVoices() {
  const [items, setItems] = useIndexedDB<VoiceRecording[]>("voices", []);
  return { items, setItems, add: (v: Omit<VoiceRecording, "id">) => { const n = { ...v, id: "v" + Date.now() }; setItems([...items, n]); } };
}

export function useWisdom() {
  const [items, setItems] = useIndexedDB<WisdomItem[]>("wisdom", seedWisdom);
  return { items, setItems, add: (w: Omit<WisdomItem, "id" | "gradient">) => { const n = { ...w, id: "w" + Date.now(), gradient: getGradient(items.length) }; setItems([...items, n]); } };
}

export function useGallery() {
  const [items, setItems] = useIndexedDB<GalleryPhoto[]>("gallery", []);
  return { items, setItems, add: (g: Omit<GalleryPhoto, "id">) => { const n = { ...g, id: "g" + Date.now() }; setItems([...items, n]); } };
}

export function useLoveLetters() {
  const [items, setItems] = useIndexedDB<LoveLetter[]>("loveLetters", seedLoveLetters);
  return { items, setItems, add: (l: Omit<LoveLetter, "id">) => { const n = { ...l, id: "ll" + Date.now() }; setItems([...items, n]); }, remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function useGratitude() {
  const [items, setItems] = useIndexedDB<GratitudeEntry[]>("gratitude", seedGratitude);
  return { items, setItems, add: (g: Omit<GratitudeEntry, "id">) => { const n = { ...g, id: "gr" + Date.now() }; setItems([...items, n]); }, remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function useQuiz() {
  const [items, setItems] = useIndexedDB<QuizQuestion[]>("quiz", seedQuiz);
  return { items, setItems, add: (q: Omit<QuizQuestion, "id">) => { const n = { ...q, id: "q" + Date.now() }; setItems([...items, n]); }, update: (id: string, data: Partial<QuizQuestion>) => setItems(items.map((i) => i.id === id ? { ...i, ...data } : i)), remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function useFamily() {
  const [items, setItems] = useIndexedDB<FamilyMember[]>("familyTree", seedFamily);
  return { items, setItems, add: (f: Omit<FamilyMember, "id">) => { const n = { ...f, id: "fm" + Date.now() }; setItems([...items, n]); }, remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function usePromises() {
  const [items, setItems] = useIndexedDB<PromiseItem[]>("promises", seedPromises);
  return { items, setItems, add: (p: Omit<PromiseItem, "id">) => { const n = { ...p, id: "pr" + Date.now() }; setItems([...items, n]); }, toggle: (id: string) => setItems(items.map((i) => i.id === id ? { ...i, kept: !i.kept, dateKept: !i.kept ? new Date().toISOString().split("T")[0] : null } : i)), remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function useCelebration() {
  const [config, setConfig] = useIndexedDB<CelebrationConfig>("celebration", seedCelebration);
  return { config, setConfig };
}

export function useCollages() {
  const [items, setItems] = useIndexedDB<CollageItem[]>("collages", []);
  return { items, setItems, add: (c: Omit<CollageItem, "id">) => { const n = { ...c, id: "cl" + Date.now() }; setItems([...items, n]); }, remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function useCoupons() {
  const [items, setItems] = useIndexedDB<CouponItem[]>("coupons", seedCoupons);
  return { items, setItems, add: (c: Omit<CouponItem, "id">) => { const n = { ...c, id: "cp" + Date.now() }; setItems([...items, n]); }, redeem: (id: string) => setItems(items.map((i) => i.id === id ? { ...i, redeemed: !i.redeemed, dateRedeemed: !i.redeemed ? new Date().toISOString().split("T")[0] : null } : i)), remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function useBucketList() {
  const [items, setItems] = useIndexedDB<BucketListItem[]>("bucketList", seedBucketList);
  return { items, setItems, add: (b: Omit<BucketListItem, "id">) => { const n = { ...b, id: "bl" + Date.now() }; setItems([...items, n]); }, toggle: (id: string) => setItems(items.map((i) => i.id === id ? { ...i, completed: !i.completed } : i)), remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function useGiftBox() {
  const [items, setItems] = useIndexedDB<GiftItem[]>("giftBox", []);
  return { items, setItems, add: (g: Omit<GiftItem, "id">) => { const n = { ...g, id: "gf" + Date.now() }; setItems([...items, n]); }, open: (id: string) => setItems(items.map((i) => i.id === id ? { ...i, opened: true } : i)), remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function useMemoryJar() {
  const [items, setItems] = useIndexedDB<JarNote[]>("memoryJar", seedJarNotes);
  return { items, setItems, add: (j: Omit<JarNote, "id">) => { const n = { ...j, id: "jn" + Date.now() }; setItems([...items, n]); }, remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function usePhotoBooth() {
  const [items, setItems] = useIndexedDB<BoothPhoto[]>("photoBooth", []);
  return { items, setItems, add: (p: Omit<BoothPhoto, "id">) => { const n = { ...p, id: "pb" + Date.now() }; setItems([...items, n]); }, remove: (id: string) => setItems(items.filter((i) => i.id !== id)) };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
