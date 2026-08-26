"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Bookmark,
  Trash2,
  ArrowUpRight,
  Share2,
  Sparkles,
  MessageCircle,
  Edit3,
  Check,
  Cloud,
  RefreshCw,
  Scale
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OOTDRecommendation } from "@/lib/types";
import OutfitCompareModal from "./OutfitCompareModal";
import {
  signInWithGoogle,
  syncLocalWardrobeToCloud,
  fetchCloudWardrobe,
  deleteCloudWardrobeItem,
  updateCloudWardrobeItem,
  getCurrentUser
} from "@/lib/supabase";

interface SavedLooksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOutfit: (outfit: OOTDRecommendation) => void;
  onExportStory: (outfit: OOTDRecommendation) => void;
}

export default function SavedLooksDrawer({
  isOpen,
  onClose,
  onSelectOutfit,
  onExportStory,
}: SavedLooksDrawerProps) {
  const [savedOutfits, setSavedOutfits] = useState<OOTDRecommendation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("looku_saved_outfits");
        if (stored) {
          setSavedOutfits(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error reading saved outfits:", e);
      }
    }
  }, [isOpen]);

  const handleDelete = async (id: string) => {
    const updated = savedOutfits.filter((item) => item.id !== id);
    setSavedOutfits(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_saved_outfits", JSON.stringify(updated));
      window.dispatchEvent(new Event("looku_saved_updated"));
    }
    await deleteCloudWardrobeItem(id);
  };

  const handleStartEdit = (outfit: OOTDRecommendation) => {
    setEditingId(outfit.id);
    setEditTitle(outfit.title);
    setEditNotes((outfit as any).notes || "");
  };

  const handleSaveEdit = async (id: string) => {
    const updated = savedOutfits.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          title: editTitle.trim() || item.title,
          notes: editNotes.trim(),
        };
      }
      return item;
    });

    setSavedOutfits(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_saved_outfits", JSON.stringify(updated));
    }
    await updateCloudWardrobeItem(id, { description: editTitle, notes: editNotes });
    setEditingId(null);
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setSyncStatus("Menghubungkan ke Cloud...");

    try {
      const user = await getCurrentUser();
      if (!user || user.id === "mock-user") {
        // Prompt Google OAuth login
        await signInWithGoogle();
        setIsSyncing(false);
        setSyncStatus(null);
        return;
      }

      // Sync local to cloud
      await syncLocalWardrobeToCloud(savedOutfits);

      // Fetch cloud items and merge
      const cloudItems = await fetchCloudWardrobe();
      if (cloudItems && cloudItems.length > 0) {
        // Merge without duplicates
        const existingIds = new Set(savedOutfits.map((o) => o.id));
        const newMerged = [...savedOutfits];

        cloudItems.forEach((c: any) => {
          if (!existingIds.has(c.id)) {
            newMerged.push({
              id: c.id,
              title: c.description || "Cloud Outfit",
              tagline: c.notes || "Tersinkronisasi dari Akun Google",
              overallVibe: "Cloud Sync",
              comfortRating: 5,
              affordabilityRating: 5,
              modestFriendly: true,
              skinToneMatch: "Cocok untuk semua undertone warna kulit.",
              whyItWorks: "Koleksi tersinkronisasi dari lemari cloud Google kamu.",
              stylingTip: "Padukan dengan alas kaki yang senada.",
              colorPalette: Array.isArray(c.color_palette)
                ? c.color_palette.map((hex: string) => ({ name: "Cloud Color", hex }))
                : [{ name: "Charcoal", hex: "#181A18" }, { name: "Sand", hex: "#FAF8F5" }],
              items: c.items || [],
              createdAt: c.created_at || new Date().toISOString(),
            });
          }
        });

        setSavedOutfits(newMerged);
        if (typeof window !== "undefined") {
          localStorage.setItem("looku_saved_outfits", JSON.stringify(newMerged));
        }
      }

      setSyncStatus("Tersinkronisasi ☁️");
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      console.error("Cloud sync error:", err);
      setSyncStatus("Gagal sinkron");
      setTimeout(() => setSyncStatus(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleShareWhatsApp = (outfit: OOTDRecommendation) => {
    const text = `🧥 *${outfit.title}* - Kurasi Looku AI\n"${outfit.tagline}"\n\n✨ *Items:*\n${outfit.items
      .map((i) => `• ${i.name} (${i.color})`)
      .join("\n")}\n\n💡 *Tips:* ${outfit.stylingTip || "Gunakan bahan katun rayon/linen yang adem."}\n\nCoba outfit kamu di https://looku.ai`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleBatchShare = () => {
    const text =
      `🧥 *Lemari Koleksiku* - Kurasi Looku AI\n\n` +
      savedOutfits
        .map(
          (o, idx) =>
            `${idx + 1}. ✨ *${o.title}*\n"${o.tagline}"\n`
        )
        .join("\n") +
      `\nCoba outfit kamu di https://looku.ai`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const vibeCounts = savedOutfits.reduce((acc, curr) => {
    acc[curr.overallVibe] = (acc[curr.overallVibe] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dominantVibe =
    Object.entries(vibeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Earthy Minimalist";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#181A18]/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:w-auto">
            {/* Drawer Canvas */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full sm:w-screen sm:max-w-md bg-[#FAF8F5] border-l border-[#D7CABC] flex flex-col shadow-2xl pb-[env(safe-area-inset-bottom,0px)]"
            >
              {/* Header */}
              <div className="p-6 bg-[#181A18] text-white flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-terracotta-500 flex items-center justify-center text-white">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg">Lemari Koleksi Kamu</h3>
                    <p className="text-[10px] font-mono text-[#D7CABC] uppercase tracking-wider">
                      {savedOutfits.length} Formula OOTD • Dominasi {dominantVibe}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-[#A89582] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Style Evolution Metric Card */}
              <div className="p-3.5 mx-5 mt-4 rounded-2xl bg-sand-100 border border-sand-300 space-y-1.5 shadow-2xs shrink-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-charcoal-900 font-serif">📈 Gaya Makin Konsisten</span>
                  <span className="text-[10px] font-mono font-bold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-100">
                    +40% BULAN INI
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-900/70 leading-tight">
                  {savedOutfits.length > 0
                    ? `Koleksi kamu didominasi nuansa ${dominantVibe}. Sangat proporsional untuk iklim tropis sehari-hari.`
                    : "Simpan formula OOTD pertamamu untuk mulai membangun indeks konsistensi gaya personal."}
                </p>
              </div>

              {/* Cloud Sync Card */}
              <div className="p-4 mx-5 mt-3 rounded-2xl bg-[#E8F0FE] border border-[#D2E3FC] space-y-2 shadow-2xs shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-blue-700" />
                    <span className="font-bold text-blue-900 font-serif text-xs">Lemari Cloud Sync</span>
                  </div>
                  {syncStatus && (
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                      {syncStatus}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-blue-800/80 leading-relaxed">
                  Sinkronkan dengan akun Google agar lemarimu aman dan bisa dibuka di semua HP/laptop.
                </p>
                <button
                  onClick={handleCloudSync}
                  disabled={isSyncing}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Menyinkronkan..." : "🔐 Sinkronkan ke Cloud"}</span>
                </button>
              </div>

              {/* Quick Compare Button */}
              {savedOutfits.length >= 2 && (
                <div className="px-5 mt-2 shrink-0">
                  <button
                    onClick={() => setIsCompareOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    <Scale className="w-3.5 h-3.5 text-terracotta-600" />
                    <span>⚖️ Bandingkan 2 Outfit Lemari</span>
                  </button>
                </div>
              )}

              {/* Body Content */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {savedOutfits.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8DFD1] text-[#A89582] flex items-center justify-center mx-auto shadow-inner">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#181A18]">
                      Lemari Koleksi Masih Kosong
                    </h4>
                    <p className="text-xs text-[#A89582] max-w-xs mx-auto leading-relaxed">
                      Simpan formula OOTD favoritmu dari Lookbook atau Studio untuk inspirasi outfit harian.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 py-3 px-6 rounded-xl bg-[#181A18] text-white font-bold text-xs uppercase tracking-wider hover:bg-terracotta-500 transition-all shadow-md"
                    >
                      Mulai Mix & Match Sekarang ↗
                    </button>
                  </div>
                ) : (
                  <>
                    {savedOutfits.map((outfit) => (
                      <motion.div
                        key={outfit.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 rounded-2xl bg-white border border-[#E8DFD1] shadow-2xs space-y-3"
                      >
                        {editingId === outfit.id ? (
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold uppercase text-sand-500 block">
                              Edit Judul Formula
                            </label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-sand-50 border border-sand-300 text-xs font-bold text-charcoal-900"
                            />
                            <label className="text-[10px] font-mono font-bold uppercase text-sand-500 block">
                              Catatan Personal (Opsional)
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Dipakai pas meeting Jumat / Kondangan"
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-sand-50 border border-sand-300 text-xs text-charcoal-900"
                            />
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => setEditingId(null)}
                                className="flex-1 py-1 rounded bg-sand-100 text-charcoal-900 text-xs font-bold"
                              >
                                Batal
                              </button>
                              <button
                                onClick={() => handleSaveEdit(outfit.id)}
                                className="flex-1 py-1 rounded bg-charcoal-900 text-white text-xs font-bold"
                              >
                                Simpan
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[9px] font-mono uppercase text-terracotta-600 font-bold tracking-wider">
                                {outfit.overallVibe}
                              </span>
                              <h4 className="font-serif font-bold text-base text-[#181A18]">
                                {outfit.title}
                              </h4>
                              {(outfit as any).notes ? (
                                <p className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono mt-1">
                                  📝 {(outfit as any).notes}
                                </p>
                              ) : (
                                <p className="text-xs text-[#A89582] line-clamp-1 italic">
                                  &ldquo;{outfit.tagline}&rdquo;
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleStartEdit(outfit)}
                                className="p-1.5 text-sand-500 hover:text-charcoal-900 hover:bg-sand-100 rounded-lg transition-colors"
                                title="Edit catatan"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(outfit.id)}
                                className="p-1.5 text-[#A89582] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Hapus dari lemari"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Items Preview */}
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                          {outfit.colorPalette.map((col: any, idx: number) => {
                            const hex = typeof col === "string" ? col : col.hex;
                            const name = typeof col === "string" ? col : col.name;
                            return (
                              <div
                                key={idx}
                                className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: hex }}
                                title={name}
                              />
                            );
                          })}
                          <span className="text-[10px] font-mono text-[#A89582] ml-1">
                            {outfit.items.length} pieces
                          </span>
                        </div>

                        {/* Action Row */}
                        <div className="pt-2 border-t border-[#E8DFD1] flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              onSelectOutfit(outfit);
                              onClose();
                            }}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <span>Muat ke Studio</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onExportStory(outfit)}
                            className="p-1.5 rounded-xl border border-[#D7CABC] hover:bg-[#F4EFE6] text-[#181A18] transition-colors"
                            title="Export Instagram Story"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleShareWhatsApp(outfit)}
                            className="p-1.5 rounded-xl border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                            title="Bagikan ke WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}

                    {savedOutfits.length > 1 && (
                      <button
                        onClick={handleBatchShare}
                        className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Bagikan Seluruh Lemari via WhatsApp</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Outfit Compare Modal */}
      <OutfitCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        savedOutfits={savedOutfits}
        onSelectOutfitToStudio={(outfit) => {
          onSelectOutfit(outfit);
          onClose();
        }}
      />
    </AnimatePresence>
  );
}
