"use client";

const DB_NAME = "loveyoumom-db";
const DB_VERSION = 1;

const STORES = [
  "memories",
  "recipes",
  "voices",
  "wisdom",
  "gallery",
  "loveLetters",
  "gratitude",
  "quiz",
  "familyTree",
  "promises",
  "celebration",
] as const;

export type StoreName = (typeof STORES)[number];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store);
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbPut<T>(store: StoreName, data: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(data, store);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function dbGet<T>(store: StoreName): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).get(store);
    req.onsuccess = () => { db.close(); resolve(req.result as T | undefined); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function dbGetAll<T>(store: StoreName): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => { db.close(); resolve(req.result as T[]); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function dbDelete(store: StoreName): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(store);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function dbClearAll(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([...STORES], "readwrite");
    for (const store of STORES) {
      tx.objectStore(store).clear();
    }
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function exportAllData(): Promise<Record<string, unknown>> {
  const data: Record<string, unknown> = {};
  for (const store of STORES) {
    data[store] = await dbGet(store);
  }
  return data;
}

export async function importAllData(data: Record<string, unknown>): Promise<void> {
  for (const store of STORES) {
    if (data[store] !== undefined) {
      await dbPut(store, data[store]);
    }
  }
}

// Map of store names to their old localStorage keys
export const MIGRATION_MAP: Record<StoreName, string> = {
  memories: "mk-memories",
  recipes: "mk-recipes",
  voices: "mk-voices",
  wisdom: "mk-wisdom",
  gallery: "mk-gallery",
  loveLetters: "mk-love-letters",
  gratitude: "mk-gratitude",
  quiz: "mk-quiz",
  familyTree: "mk-family",
  promises: "mk-promises",
  celebration: "mk-celebration",
};

export async function migrateFromLocalStorage(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  let migrated = false;
  for (const [store, key] of Object.entries(MIGRATION_MAP)) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        await dbPut(store as StoreName, data);
        localStorage.removeItem(key);
        migrated = true;
      } catch { /* skip bad data */ }
    }
  }
  return migrated;
}
