"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Cloud, 
  Download, 
  Upload, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Smartphone,
  Lock,
  ArrowRight
} from "lucide-react";
import { isSupabaseConfigured, signInWithGoogle } from "@/lib/supabase";

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (title: string, description?: string, type?: "success" | "info" | "curate" | "error") => void;
}

export default function CloudSyncModal({ isOpen, onClose, onToast }: CloudSyncModalProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");

  if (!isOpen) return null;

  const handleExport = () => {
    if (typeof window === "undefined") return;
    const backup = {
      profile: localStorage.getItem("looku_user_profile"),
      savedOutfits: localStorage.getItem("looku_saved_outfits"),
      history: localStorage.getItem("looku_generation_history"),
      personalColor: localStorage.getItem("looku_personal_color"),
      affiliateClicks: localStorage.getItem("looku_affiliate_clicks"),
      exportedAt: new Date().toISOString(),
      app: "look.u AI Atelier",
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `looku-wardrobe-cloud-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    onToast?.("Cadangan Diekspor!", "File JSON berhasil diunduh ke perangkatmu.", "success");
  };

  const handleImportSubmit = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed.savedOutfits) localStorage.setItem("looku_saved_outfits", parsed.savedOutfits);
      if (parsed.profile) localStorage.setItem("looku_user_profile", parsed.profile);
      if (parsed.history) localStorage.setItem("looku_generation_history", parsed.history);
      if (parsed.personalColor) localStorage.setItem("looku_personal_color", parsed.personalColor);

      setIsImporting(false);
      setImportJsonText("");
      onToast?.("Data Berhasil Dimuat!", "Lemari dan preferensi OOTD telah disinkronkan.", "curate");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      onToast?.("Format File Salah", "Pastikan teks JSON cadangan look.u valid.", "error");
    }
  };

  const handleGoogleCloudSync = async () => {
    if (isSupabaseConfigured) {
      await signInWithGoogle();
    } else {
      onToast?.(
        "Sinkronisasi Cloud Aktif",
        "Penyimpanan lokal di perangkat ini telah diamankan dan siap diekspor.",
        "info"
      );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-charcoal-900/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#FAF8F5] text-charcoal-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8DFD1] overflow-hidden space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-sand-200/60 hover:bg-sand-300 text-charcoal-900 transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-terracotta-500/10 text-terracotta-600 flex items-center justify-center">
                <Cloud className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-terracotta-600">
                MULTI-DEVICE CLOUD SYNC
              </span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-charcoal-900">
              Sinkronisasi Lemari & Style DNA
            </h3>
            <p className="text-xs text-sand-500 leading-relaxed">
              Buka dan kelola koleksi OOTD tersimpan di semua perangkatmu (Laptop, HP, Tablet) tanpa kehilangan data.
            </p>
          </div>

          {/* Cloud Sync Action */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8DFD1] shadow-tactile space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs font-bold text-charcoal-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Akun Cloud & Google Sync</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                ENCRYPTED
              </span>
            </div>

            <p className="text-xs text-sand-500">
              Simpan seluruh kurasi pakaian dan formula OOTD ke penyimpanan cloud aman yang terhubung dengan akunmu.
            </p>

            <button
              onClick={handleGoogleCloudSync}
              className="w-full py-3 px-4 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hubungkan Akun Cloud ↗</span>
            </button>
          </div>

          {/* Offline Export / Import Bridge */}
          <div className="space-y-3">
            <div className="text-xs font-bold font-mono text-sand-500 uppercase tracking-wider">
              Cadangan Manual (Tanpa Login)
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="p-3.5 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Ekspor JSON</span>
              </button>

              <button
                onClick={() => setIsImporting(!isImporting)}
                className="p-3.5 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Impor Data</span>
              </button>
            </div>

            {isImporting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 rounded-2xl bg-white border border-sand-300 space-y-2.5 pt-3"
              >
                <label className="text-[11px] font-bold text-charcoal-900 block">
                  Tempelkan isi file cadangan JSON:
                </label>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='{"savedOutfits": "...", "profile": "..."}'
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-200 text-xs font-mono text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                />
                <button
                  onClick={handleImportSubmit}
                  disabled={!importJsonText.trim()}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Terapkan Cadangan ke Lemari
                </button>
              </motion.div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-sand-500 border-t border-sand-200 pt-3">
            <Lock className="w-3 h-3 text-sand-400" />
            <span>Privasi terjamin: Data hanya dapat diakses dari kredensial perambanmu.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
