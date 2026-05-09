"use client";

import { useState, useEffect, useRef } from "react";
import { exportAllData, importAllData, dbClearAll } from "@/lib/db";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DataManager() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState("...");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    async function calc() {
      try {
        const data = await exportAllData();
        const bytes = new Blob([JSON.stringify(data)]).size;
        setSize(formatBytes(bytes));
      } catch {
        setSize("?");
      }
    }
    calc();
  }, [open]);

  async function handleExport() {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loveyoumom-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    }
  }

  async function handleImport() {
    fileRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importAllData(data);
      alert("Data imported successfully! Refresh the page to see changes.");
    } catch {
      alert("Invalid backup file");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleClear() {
    if (!confirm("This will delete ALL your data. Are you sure?")) return;
    try {
      await dbClearAll();
      alert("All data cleared. Refresh the page to start fresh.");
    } catch {
      alert("Failed to clear data");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-lg"
        title="Data Manager"
      >
        ⚙️
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 mx-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">⚙️ Data Manager</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl">✕</button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Storage used: <span className="font-semibold text-gray-700 dark:text-gray-200">{size}</span>
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleExport}
                className="w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium transition text-sm"
              >
                📥 Export Backup
              </button>

              <button
                onClick={handleImport}
                className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition text-sm"
              >
                📤 Import Backup
              </button>
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

              <button
                onClick={handleClear}
                className="w-full py-2.5 px-4 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl font-medium transition text-sm"
              >
                🗑️ Clear All Data
              </button>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
              Data is stored in your browser&apos;s IndexedDB
            </p>
          </div>
        </div>
      )}
    </>
  );
}
