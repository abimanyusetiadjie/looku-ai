"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, X, Trash2, ArrowUpRight, Clock } from "lucide-react";
import { OOTDRecommendation } from "@/lib/types";

interface HistoryEntry {
  id: string;
  timestamp: string;
  outfit: OOTDRecommendation;
}

interface GenerationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOutfit: (outfit: OOTDRecommendation) => void;
  onSaveToWardrobe?: (outfit: OOTDRecommendation) => void;
}

export default function GenerationHistoryModal({
  isOpen,
  onClose,
  onSelectOutfit,
  onSaveToWardrobe,
}: GenerationHistoryModalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      try {
        const stored = localStorage.getItem("looku_generation_history");
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error reading generation history:", e);
      }
    }
  }, [isOpen]);

  const handleDeleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_generation_history", JSON.stringify(updated));
    }
  };

  const handleClearAll = () => {
    if (confirm("Apakah kamu yakin ingin menghapus seluruh riwayat kurasi?")) {
      setHistory([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem("looku_generation_history");
      }
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Baru saja";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-charcoal-900/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-sand-300 z-10 space-y-4 h-[88dvh] sm:h-auto sm:max-h-[85vh] flex flex-col pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]"
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="sm:hidden w-full flex justify-center pb-2 -mt-2">
          <div className="w-10 h-1 rounded-full bg-sand-300" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand-200 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center text-charcoal-900">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Riwayat Kurasi AI
              </h3>
              <p className="text-[10px] font-mono text-sand-500 uppercase tracking-wider">
                {history.length} Formula Tersimpan di Perangkat Ini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[10px] font-mono text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition-colors uppercase font-bold"
              >
                Hapus Semua
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-sand-500 hover:text-charcoal-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sand-100 text-sand-400 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-charcoal-900">
                Belum Ada Riwayat Kurasi
              </h4>
              <p className="text-xs text-sand-500 max-w-xs mx-auto leading-relaxed">
                Setiap kali kamu membuat formula OOTD di Studio AI, hasilnya akan otomatis tercatat di sini.
              </p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-sand-50/70 border border-sand-200 hover:border-sand-400 transition-colors space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono uppercase text-terracotta-600 font-bold tracking-wider">
                        {entry.outfit.overallVibe || "Casual"}
                      </span>
                      <span className="text-[10px] text-sand-500 font-mono">
                        • {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-charcoal-900">
                      {entry.outfit.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(entry.id)}
                    className="p-1 text-sand-400 hover:text-rose-600 rounded transition-colors"
                    title="Hapus riwayat ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Items & Palettes */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {entry.outfit.colorPalette?.map((col: any, i: number) => {
                      const hex = typeof col === "string" ? col : col.hex;
                      return (
                        <div
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                      );
                    })}
                    <span className="text-[10px] font-mono text-sand-500 ml-1">
                      {entry.outfit.items?.length || 0} pieces
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectOutfit(entry.outfit);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <span>Muat</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
