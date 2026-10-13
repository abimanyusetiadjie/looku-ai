"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  CloudSun,
  Check,
  ChevronDown,
  ChevronRight,
  Shirt,
  Sparkles,
  Calendar,
  Settings,
  Trash2,
  Share2,
  Scale,
  Plus,
  X,
  Cloud,
  RefreshCw,
  Search,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Toast, { ToastMessage } from "@/components/Toast";
import StoryShareModal from "@/components/StoryShareModal";
import OutfitCompareModal from "@/components/OutfitCompareModal";
import WeeklyOutfitCalendar from "@/components/WeeklyOutfitCalendar";
import { OOTDRecommendation, OutfitItem } from "@/lib/types";
import { useWeather } from "@/hooks/useWeather";
import { computeBreathability } from "@/lib/breathability";
import { getMarketplaceLinks, trackAffiliateClick } from "@/lib/affiliate";
import {
  signInWithGoogle,
  syncLocalWardrobeToCloud,
  deleteCloudWardrobeItem,
  updateCloudWardrobeItem,
  getCurrentUser,
} from "@/lib/supabase";

const STORAGE_KEY = "looku_saved_outfits";

const STARTER_ITEMS: OutfitItem[] = [
  {
    name: "Linen Crinkle Kulot",
    category: "bawahan",
    color: "Rose Pink",
    colorHex: "#D9A5A0",
    estimatedPrice: "Rp 150.000",
    material: "Linen Crinkle",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80",
    shopeeQuery: "kulot linen crinkle wanita",
    tokopediaQuery: "kulot linen crinkle wanita",
  },
  {
    name: "Linen Shirt",
    category: "atasan",
    color: "Off White",
    colorHex: "#F3EFE6",
    estimatedPrice: "Rp 120.000",
    material: "Linen",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    shopeeQuery: "kemeja linen wanita off white",
    tokopediaQuery: "kemeja linen wanita off white",
  },
  {
    name: "Cotton Hijab",
    category: "outer_hijab",
    color: "Natural",
    colorHex: "#D8C8AE",
    estimatedPrice: "Rp 85.000",
    material: "Katun Voal",
    imageUrl: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=400&q=80",
    shopeeQuery: "hijab voal katun natural",
    tokopediaQuery: "hijab voal katun natural",
  },
];

function readSaved(): OOTDRecommendation[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { weather } = useWeather();

  // Active Tab: 'wardrobe' | 'mixmatch' | 'calendar' | 'settings'
  const initialTab = searchParams.get("tab") || "wardrobe";
  const [activeTab, setActiveTab] = useState<string>(
    ["wardrobe", "mixmatch", "calendar", "settings"].includes(initialTab) ? initialTab : "wardrobe"
  );

  // Profile Information
  const [name, setName] = useState("Alya");
  const [height, setHeight] = useState("162 cm");
  const [size, setSize] = useState("S");
  const [hijab, setHijab] = useState("Yes");
  const [preferences, setPreferences] = useState([
    { id: "hijab_friendly", label: "HIJAB FRIENDLY", active: true },
    { id: "breathable", label: "BREATHABLE", active: true },
    { id: "lightweight", label: "LIGHTWEIGHT", active: true },
    { id: "modest", label: "MODEST", active: true },
    { id: "campus", label: "CAMPUS", active: true },
  ]);

  // Wardrobe & Saved Outfits State
  const [savedOutfits, setSavedOutfits] = useState<OOTDRecommendation[]>([]);
  const [boardItems, setBoardItems] = useState<OutfitItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modals & UI States
  const [isDragOver, setIsDragOver] = useState(false);
  const [showShopList, setShowShopList] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [storyOutfit, setStoryOutfit] = useState<OOTDRecommendation | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Editing notes
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const addToast = (t: Omit<ToastMessage, "id">) =>
    setToasts((prev) => [...prev, { ...t, id: Math.random().toString(36).slice(2, 9) }]);

  // Sync saved outfits
  useEffect(() => {
    const sync = () => setSavedOutfits(readSaved());
    sync();
    window.addEventListener("looku_saved_updated", sync);
    return () => window.removeEventListener("looku_saved_updated", sync);
  }, []);

  // Update tab when URL query changes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["wardrobe", "mixmatch", "calendar", "settings"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Check auth user
  useEffect(() => {
    getCurrentUser().then(setCurrentUser).catch(() => {});
  }, []);

  // Unique wardrobe items across all saved looks
  const { myItems, usingStarter } = useMemo(() => {
    const items: OutfitItem[] = [];
    savedOutfits.forEach((o) =>
      o.items.forEach((i) => {
        if (!items.some((e) => e.name === i.name)) items.push(i);
      })
    );
    if (items.length >= 3) return { myItems: items, usingStarter: false };
    const padded = [...items, ...STARTER_ITEMS.filter((s) => !items.some((i) => i.name === s.name))];
    return { myItems: padded, usingStarter: true };
  }, [savedOutfits]);

  const temperature = weather.temperature;
  const city = weather.isSimulated ? "Pontianak" : weather.location.charAt(0) + weather.location.slice(1).toLowerCase();
  const analysis = useMemo(() => computeBreathability(boardItems, temperature), [boardItems, temperature]);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const isOnBoard = (item: OutfitItem) => boardItems.some((i) => i.name === item.name);

  const toggleOnBoard = (item: OutfitItem) => {
    setBoardItems((prev) =>
      prev.some((i) => i.name === item.name)
        ? prev.filter((i) => i.name !== item.name)
        : [...prev.filter((i) => i.category !== item.category), item]
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const item: OutfitItem = JSON.parse(e.dataTransfer.getData("application/json"));
      if (!isOnBoard(item)) toggleOnBoard(item);
    } catch {
      // ignore
    }
  };

  const handleSaveMixLook = () => {
    if (boardItems.length < 2) return;
    const newLook: OOTDRecommendation = {
      id: `mix-${Date.now()}`,
      title: `Mix & Match — ${boardItems.map((i) => i.name.split(" ")[0]).join(" + ")}`,
      tagline: analysis.verdict,
      overallVibe: "Personal Mix",
      comfortRating: Math.max(1, Math.round(analysis.score / 20)),
      affordabilityRating: 4,
      modestFriendly: analysis.isModest,
      skinToneMatch: "Dipadukan sendiri dari lemari",
      whyItWorks: `Breathable score ${analysis.score}% untuk ${temperature}°C. ${analysis.traits.join(", ")}.`,
      stylingTip: "Diracik di Mix & Match Canvas.",
      colorPalette: boardItems.map((i) => ({ name: i.color, hex: i.colorHex || "#C69365" })),
      items: boardItems,
      createdAt: new Date().toISOString(),
    };
    const updated = [newLook, ...readSaved()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_saved_updated"));
    addToast({ title: "Look Tersimpan di Lemari", description: newLook.title, type: "save" });
  };

  const handleDeleteOutfit = (id: string, title: string) => {
    const updated = savedOutfits.filter((o) => o.id !== id);
    setSavedOutfits(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_saved_updated"));
    deleteCloudWardrobeItem(id).catch(() => {});
    addToast({ title: "Look Dihapus", description: title, type: "info" });
  };

  const handleSaveNotes = async (id: string) => {
    const updated = savedOutfits.map((item) => {
      if (item.id === id) {
        return { ...item, notes: editNotes.trim() };
      }
      return item;
    });
    setSavedOutfits(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    await updateCloudWardrobeItem(id, { notes: editNotes });
    setEditingId(null);
    addToast({ title: "Catatan Disimpan", description: "Catatan outfit berhasil diperbarui", type: "success" });
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const user = await getCurrentUser();
      if (!user) {
        await signInWithGoogle();
        setIsSyncing(false);
        return;
      }
      const ok = await syncLocalWardrobeToCloud(savedOutfits);
      if (ok) {
        setSyncStatus(`Tersinkron ${savedOutfits.length} outfit`);
        addToast({ title: "Sinkronisasi Berhasil", description: "Lemari tersinkron dengan cloud", type: "success" });
      } else {
        setSyncStatus("Gagal sinkronisasi");
      }
    } catch (e: any) {
      setSyncStatus("Error sinkron");
    } finally {
      setIsSyncing(false);
    }
  };

  // Filtered saved outfits
  const filteredOutfits = useMemo(() => {
    if (!searchQuery.trim()) return savedOutfits;
    const q = searchQuery.toLowerCase();
    return savedOutfits.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        (o.overallVibe && o.overallVibe.toLowerCase().includes(q)) ||
        o.items.some((i) => i.name.toLowerCase().includes(q) || i.color.toLowerCase().includes(q))
    );
  }, [savedOutfits, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--ds-sand)] text-charcoal-900 pb-28 font-sans selection:bg-charcoal-900 selection:text-white">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* ============================================================ */}
        {/* TOP PROFILE EDITORIAL HERO SECTION */}
        {/* ============================================================ */}
        <section className="bg-white border border-charcoal-900 rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Identity Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-charcoal-900 text-[var(--ds-sand)] flex items-center justify-center font-serif text-3xl sm:text-4xl shadow-inner border-2 border-white">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="Active Stylist Profile" />
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 tracking-tight">{name}</h1>
                  <span className="text-[10px] font-mono uppercase bg-terracotta-50 text-terracotta-700 font-bold px-2.5 py-0.5 rounded-full border border-terracotta-200">
                    Warm Autumn
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal-900/70 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-600" /> {city} {temperature}°C
                  </span>
                  <span>•</span>
                  <span>Tinggi {height} ({size})</span>
                  <span>•</span>
                  <span>Hijab: {hijab}</span>
                </div>
                <p className="font-serif italic text-xs sm:text-sm text-charcoal-900/80 mt-2 max-w-md">
                  &ldquo;Curated for tropical, modest & breathable daily looks.&rdquo;
                </p>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="bg-[var(--ds-sand)] border border-charcoal-900/30 rounded-2xl px-4 py-2.5 text-center min-w-[100px] flex-1 sm:flex-none">
                <div className="font-serif text-lg font-bold leading-tight">{savedOutfits.length}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-charcoal-900/60">Looks Lemari</div>
              </div>
              <div className="bg-[var(--ds-sand)] border border-charcoal-900/30 rounded-2xl px-4 py-2.5 text-center min-w-[100px] flex-1 sm:flex-none">
                <div className="font-serif text-lg font-bold leading-tight">{myItems.length}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-charcoal-900/60">Items Unik</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl px-4 py-2.5 text-center min-w-[100px] flex-1 sm:flex-none">
                <div className="font-serif text-lg font-bold text-emerald-800 leading-tight">
                  {savedOutfits.length >= 3 ? "Optimal" : savedOutfits.length > 0 ? "Aktif" : "Mulai"}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Rotasi Lemari</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* EDITORIAL NAVIGATION TABS */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 border-b border-charcoal-900/20">
          <button
            onClick={() => setActiveTab("wardrobe")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${
              activeTab === "wardrobe"
                ? "bg-charcoal-900 text-white shadow-sm"
                : "bg-white/80 hover:bg-white text-charcoal-900/70 border border-charcoal-900/20"
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Lemari OOTD ({savedOutfits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("mixmatch")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${
              activeTab === "mixmatch"
                ? "bg-charcoal-900 text-white shadow-sm"
                : "bg-white/80 hover:bg-white text-charcoal-900/70 border border-charcoal-900/20"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mix & Match Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${
              activeTab === "calendar"
                ? "bg-charcoal-900 text-white shadow-sm"
                : "bg-white/80 hover:bg-white text-charcoal-900/70 border border-charcoal-900/20"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Kalender 7-Hari</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${
              activeTab === "settings"
                ? "bg-charcoal-900 text-white shadow-sm"
                : "bg-white/80 hover:bg-white text-charcoal-900/70 border border-charcoal-900/20"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Identitas & Preferensi</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: LEMARI OOTD (WARDROBE SAVED LOOKS) */}
        {/* ============================================================ */}
        {activeTab === "wardrobe" && (
          <div className="space-y-6">
            {/* Highlights Banner: Efficiency + Cloud Sync */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Wardrobe Efficiency Index Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-charcoal-900 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-charcoal-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Indeks Efisiensi Lemari Tropis
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {savedOutfits.length >= 3 ? "TERKURASI BAIK" : "TAHAP AWAL"}
                  </span>
                </div>
                <p className="text-xs text-charcoal-900/70 leading-relaxed">
                  {savedOutfits.length > 0
                    ? `Dengan ${savedOutfits.length} look tersimpan, pakaianmu saling melengkapi untuk cuaca ${temperature}°C, mengurangi risiko membeli pakaian duplikat yang tidak terpakai.`
                    : "Simpan formula OOTD pertamamu untuk mulai membangun rotasi pakaian harian yang adem dan terencana."}
                </p>
              </div>

              {/* Cloud Sync Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-charcoal-900 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-sm font-bold text-charcoal-900 flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-terracotta-600" />
                    Lemari Cloud & Multi-Device
                  </span>
                  {currentUser ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Terhubung ({currentUser.email || "Google"})
                    </span>
                  ) : (
                    <span className="text-[10px] text-charcoal-900/50">Lokal Browser</span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 mt-auto">
                  <p className="text-xs text-charcoal-900/60 line-clamp-1">
                    {syncStatus || "Sinkronkan koleksi agar bisa dibuka di HP & laptopmu."}
                  </p>
                  <button
                    onClick={handleCloudSync}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-terracotta-600 transition-colors shrink-0"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? "Menyinkronkan..." : "Sinkronkan"}
                  </button>
                </div>
              </div>
            </div>

            {/* Filter & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-charcoal-900/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari look, vibe, atau bahan kemeja..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-charcoal-900 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-charcoal-900 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2">
                {savedOutfits.length >= 2 && (
                  <button
                    onClick={() => setIsCompareOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-charcoal-900 text-xs font-bold uppercase tracking-wider hover:bg-charcoal-900 hover:text-white transition-colors shadow-2xs"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    Bandingkan Look
                  </button>
                )}
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-charcoal-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-terracotta-600 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Racik di Studio
                </Link>
              </div>
            </div>

            {/* Outfits Grid */}
            {filteredOutfits.length === 0 ? (
              <div className="bg-white border border-charcoal-900 rounded-3xl p-12 text-center flex flex-col items-center">
                <Shirt className="w-12 h-12 text-charcoal-900/30 mb-4 stroke-[1]" />
                <h3 className="font-serif text-xl sm:text-2xl text-charcoal-900 mb-2">
                  {searchQuery ? "Tidak ada outfit yang cocok dengan pencarian" : "Lemari OOTD masih kosong"}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-900/70 max-w-md mb-6">
                  {searchQuery
                    ? "Coba gunakan kata kunci lain seperti 'linen', 'casual', atau 'kulot'."
                    : "Mulai buat kombinasi OOTD yang breathable dan modest melalui AI Studio sekarang."}
                </p>
                <Link
                  href="/studio"
                  className="px-6 py-3 rounded-full bg-charcoal-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-terracotta-600 transition-colors"
                >
                  Mulai Racik OOTD Pertama ➔
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOutfits.map((outfit) => (
                  <article
                    key={outfit.id}
                    className="bg-white border border-charcoal-900 rounded-3xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow relative group"
                  >
                    <div>
                      {/* Outfit Preview Pieces Grid */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {outfit.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-2xl overflow-hidden bg-sand-100 border border-charcoal-900/10 relative group/item"
                          >
                            <img
                              src={item.imageUrl || "/fallback-garment.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-charcoal-900/80 text-white text-[8px] font-bold uppercase tracking-wider py-0.5 px-1 truncate text-center">
                              {item.category}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Header & Meta */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200">
                          {outfit.overallVibe || "Casual Chic"}
                        </span>
                        <span className="text-[10px] text-charcoal-900/50 font-mono">
                          {outfit.createdAt ? new Date(outfit.createdAt).toLocaleDateString("id-ID") : "Tersimpan"}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-charcoal-900 leading-snug mb-1">
                        {outfit.title}
                      </h3>
                      <p className="text-xs text-charcoal-900/70 line-clamp-2 mb-3">
                        {outfit.tagline || outfit.whyItWorks}
                      </p>

                      {/* Color Palette Swatches */}
                      {outfit.colorPalette && outfit.colorPalette.length > 0 && (
                        <div className="flex items-center gap-1.5 mb-4">
                          {outfit.colorPalette.map((col, cIdx) => (
                            <span
                              key={cIdx}
                              className="w-4 h-4 rounded-full border border-charcoal-900/30 shadow-2xs"
                              style={{ backgroundColor: col.hex }}
                              title={col.name}
                            />
                          ))}
                        </div>
                      )}

                      {/* Notes Section */}
                      {editingId === outfit.id ? (
                        <div className="mb-4 bg-sand-50 p-2.5 rounded-xl border border-charcoal-900/20">
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Tulis catatan (misal: Cocok untuk meeting Jumat)..."
                            rows={2}
                            className="w-full text-xs bg-transparent border-none focus:outline-none resize-none"
                          />
                          <div className="flex justify-end gap-1.5 mt-1">
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-[10px] px-2 py-1 rounded bg-stone-200 text-charcoal-900 font-bold"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleSaveNotes(outfit.id)}
                              className="text-[10px] px-2 py-1 rounded bg-charcoal-900 text-white font-bold"
                            >
                              Simpan
                            </button>
                          </div>
                        </div>
                      ) : (
                        (outfit as any).notes && (
                          <div className="mb-4 p-2.5 rounded-xl bg-sand-50 border border-charcoal-900/10 text-xs text-charcoal-900/80 italic flex items-center justify-between">
                            <span>&ldquo;{(outfit as any).notes}&rdquo;</span>
                            <button
                              onClick={() => {
                                setEditingId(outfit.id);
                                setEditNotes((outfit as any).notes || "");
                              }}
                              className="text-charcoal-900/40 hover:text-charcoal-900"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-charcoal-900/15 flex items-center justify-between gap-2">
                      <Link
                        href={`/studio?look=${outfit.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-charcoal-900 hover:text-terracotta-600 transition-colors"
                      >
                        Buka di Studio <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setStoryOutfit(outfit)}
                          title="Export Instagram Story 9:16"
                          className="p-2 rounded-xl text-charcoal-900/60 hover:text-charcoal-900 hover:bg-black/5 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOutfit(outfit.id, outfit.title)}
                          title="Hapus Look"
                          className="p-2 rounded-xl text-charcoal-900/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: MIX & MATCH CANVAS */}
        {/* ============================================================ */}
        {activeTab === "mixmatch" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: My Wardrobe Items Selector */}
            <div className="lg:col-span-5 bg-white border border-charcoal-900 rounded-3xl p-6 shadow-2xs">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  Item Koleksi ({myItems.length})
                </h3>
                {usingStarter && (
                  <span className="text-[10px] font-semibold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full">
                    + Item Contoh
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal-900/70 mb-4">
                Tap atau seret item ke kanvas untuk mencoba kombinasi baru.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-1">
                {myItems.map((item) => {
                  const active = isOnBoard(item);
                  return (
                    <button
                      key={item.name}
                      type="button"
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify(item))}
                      onClick={() => toggleOnBoard(item)}
                      className={`p-2.5 rounded-2xl border text-left flex flex-col transition-all cursor-grab active:cursor-grabbing ${
                        active
                          ? "bg-charcoal-900 text-white border-charcoal-900 shadow-md ring-2 ring-terracotta-400"
                          : "bg-[var(--ds-sand)] border-charcoal-900/20 hover:border-charcoal-900 text-charcoal-900"
                      }`}
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/5 mb-2">
                        <img
                          src={item.imageUrl || "/fallback-garment.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider truncate mb-0.5">
                        {item.name}
                      </div>
                      <div className="text-[9px] opacity-70 mb-2 truncate">{item.color}</div>
                      <span
                        className={`mt-auto inline-flex items-center justify-center gap-1 rounded-full border py-1 text-[8px] font-bold uppercase tracking-widest ${
                          active
                            ? "bg-white text-charcoal-900 border-white"
                            : "border-charcoal-900/40 text-charcoal-900"
                        }`}
                      >
                        {active ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                        {active ? "Dipilih" : "Tambah"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle: Flatlay Canvas */}
            <div className="lg:col-span-4 bg-white border border-charcoal-900 rounded-3xl p-6 shadow-2xs flex flex-col min-h-[460px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-charcoal-900">Mix Canvas</h3>
                <span className="text-[10px] font-mono uppercase bg-sand-100 px-2 py-0.5 rounded-full border border-sand-300">
                  {boardItems.length} Item Terpasang
                </span>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                className={`flex-1 rounded-2xl border-2 border-dashed p-4 flex flex-col transition-colors ${
                  isDragOver ? "bg-sand-100 border-charcoal-900" : "bg-sand-50/60 border-charcoal-900/25"
                }`}
              >
                {boardItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <Shirt className="w-10 h-10 text-charcoal-900/30 mb-3 stroke-[1]" />
                    <p className="font-serif italic text-base text-charcoal-900/60">Tap atau seret item ke sini</p>
                    <p className="text-[10px] text-charcoal-900/40 mt-1">
                      Pilih minimal 2 item untuk kalkulasi breathability
                    </p>
                  </div>
                ) : (
                  <div className={`grid gap-3 ${boardItems.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                    {boardItems.map((item) => (
                      <div
                        key={item.name}
                        className="relative rounded-xl overflow-hidden bg-white border border-charcoal-900/20 aspect-square shadow-2xs group"
                      >
                        <img
                          src={item.imageUrl || "/fallback-garment.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => toggleOnBoard(item)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 border border-charcoal-900/30 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-white/95 px-2 py-1 text-[9px] font-bold truncate">
                          {item.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono bg-charcoal-900 text-white px-2.5 py-0.5 rounded-full">
                  {temperature}°C
                </span>
                {analysis.score >= 85 && (
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                    ✓ Breathable
                  </span>
                )}
                {analysis.isModest && (
                  <span className="text-[10px] font-mono bg-terracotta-100 text-terracotta-800 px-2.5 py-0.5 rounded-full font-bold">
                    ✓ Hijab Friendly
                  </span>
                )}
              </div>
            </div>

            {/* Right: AI Analysis & Actions */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-charcoal-900 rounded-3xl p-5 shadow-2xs">
                <h4 className="font-serif text-sm font-bold text-charcoal-900 border-b border-charcoal-900/15 pb-2 mb-3">
                  🌡️ Analisis Suhu {temperature}°C
                </h4>
                {boardItems.length === 0 ? (
                  <p className="text-xs text-charcoal-900/60 leading-relaxed">
                    Tambahkan item ke kanvas untuk melihat kalkulasi sirkulasi udara di iklim tropis.
                  </p>
                ) : (
                  <>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span>Breathable Score</span>
                      <span className="font-mono text-terracotta-600">{analysis.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-charcoal-900 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.score}%` }}
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-charcoal-900/80 mb-3 border-t border-charcoal-900/10 pt-2">
                      <strong className="font-serif">AI Stylist:</strong> {analysis.verdict}
                    </p>
                  </>
                )}
              </div>

              <div className="bg-white border border-charcoal-900 rounded-3xl p-5 shadow-2xs space-y-2.5">
                <button
                  type="button"
                  onClick={handleSaveMixLook}
                  disabled={boardItems.length < 2}
                  className="w-full py-3 rounded-2xl bg-charcoal-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-terracotta-600 disabled:opacity-40 transition-colors shadow-sm"
                >
                  Simpan Look ke Lemari
                </button>
                <button
                  type="button"
                  onClick={() => setShowShopList(!showShopList)}
                  disabled={boardItems.length === 0}
                  className="w-full py-3 rounded-2xl bg-sand-100 border border-charcoal-900 text-charcoal-900 font-bold text-xs uppercase tracking-widest hover:bg-sand-200 disabled:opacity-40 transition-colors"
                >
                  {showShopList ? "Tutup Marketplace" : "Shop the Look"}
                </button>

                {showShopList && boardItems.length > 0 && (
                  <div className="pt-3 border-t border-charcoal-900/15 space-y-3">
                    {boardItems.map((item) => {
                      const q = item.shopeeQuery || item.name;
                      const links = getMarketplaceLinks(q);
                      return (
                        <div key={item.name} className="space-y-1">
                          <div className="text-[11px] font-bold truncate">{item.name}</div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <a
                              href={links.shopee}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trackAffiliateClick("shopee", q, "outfit_card")}
                              className="py-1.5 text-center rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold hover:bg-orange-100"
                            >
                              Shopee ↗
                            </a>
                            <a
                              href={links.tokopedia}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trackAffiliateClick("tokopedia", q, "outfit_card")}
                              className="py-1.5 text-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold hover:bg-emerald-100"
                            >
                              Tokopedia ↗
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: KALENDER 7-HARI (WEEKLY OUTFIT PLANNER) */}
        {/* ============================================================ */}
        {activeTab === "calendar" && (
          <div className="bg-white border border-charcoal-900 rounded-3xl p-6 sm:p-8 shadow-2xs">
            <div className="mb-6">
              <h3 className="font-serif text-2xl text-charcoal-900 mb-1">
                Kalender OOTD Mingguan
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-900/70">
                Rencanakan pakaianmu dari Senin hingga Minggu sesuai prakiraan cuaca tropis {city}.
              </p>
            </div>
            <WeeklyOutfitCalendar />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: IDENTITAS & PREFERENSI GAYA */}
        {/* ============================================================ */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Preferences Pills */}
            <div className="lg:col-span-7 bg-white border border-charcoal-900 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <h3 className="font-serif text-xl text-charcoal-900 mb-1">Style Preferences</h3>
                <p className="text-xs text-charcoal-900/70">
                  Filter otomatis yang selalu diprioritaskan oleh AI Stylist saat meracik formula OOTD.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {preferences.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`flex items-center gap-2 border border-charcoal-900 rounded-full py-2.5 px-4 text-xs font-bold tracking-wider uppercase transition-colors ${
                      pref.active
                        ? "bg-charcoal-900 text-white"
                        : "bg-transparent text-charcoal-900 hover:bg-black/5"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        pref.active ? "border-transparent bg-white text-charcoal-900" : "border-charcoal-900"
                      }`}
                    >
                      {pref.active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    {pref.label}
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-charcoal-900/15">
                <h3 className="font-serif text-xl text-charcoal-900 mb-3">Ukuran & Profil Tubuh</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal-900/60 block mb-1">
                      Tinggi Badan
                    </label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-sand-50 border border-charcoal-900 rounded-xl px-4 py-2 text-xs font-semibold w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal-900/60 block mb-1">
                      Ukuran Pakaian
                    </label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="bg-sand-50 border border-charcoal-900 rounded-xl px-4 py-2 text-xs font-semibold w-full focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal-900/60 block mb-1">
                      Berhijab
                    </label>
                    <div className="relative">
                      <select
                        value={hijab}
                        onChange={(e) => setHijab(e.target.value)}
                        className="bg-sand-50 border border-charcoal-900 rounded-xl px-4 py-2 text-xs font-semibold w-full appearance-none focus:outline-none cursor-pointer"
                      >
                        <option value="Yes">Ya (Hijab)</option>
                        <option value="No">Tidak</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-900/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Curated Recommendations & Account Actions */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-charcoal-900 rounded-3xl p-6 shadow-2xs">
                <h4 className="font-serif text-lg text-charcoal-900 mb-3">Rangkuman Iklim Harian</h4>
                <div className="border border-charcoal-900/20 rounded-2xl p-4 bg-sand-100/50 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold mb-1.5">
                    <CloudSun className="w-4 h-4 text-terracotta-600" />
                    {city} • {temperature}°C • Panas Tropis
                  </div>
                  <p className="text-xs text-charcoal-900/80 leading-relaxed">
                    Rekomendasi saat ini: prioritaskan katun voal atau linen crinkle untuk sirkulasi udara maksimal tanpa mengorbankan siluet modest.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => addToast({ title: "Sesi Berakhir", description: "Kamu telah keluar.", type: "info" })}
                    className="border border-charcoal-900 rounded-full px-5 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-charcoal-900 hover:text-white transition-colors"
                  >
                    LOGOUT
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Yakin ingin menghapus akun?")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="text-[10px] font-bold tracking-widest uppercase text-red-600/70 hover:text-red-700 underline underline-offset-4"
                  >
                    HAPUS AKUN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Story Export Modal */}
      {storyOutfit && (
        <StoryShareModal outfit={storyOutfit} onClose={() => setStoryOutfit(null)} />
      )}

      {/* Outfit Compare Modal */}
      <OutfitCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        savedOutfits={savedOutfits}
        onSelectOutfitToStudio={(outfit) => router.push(`/studio?look=${outfit.id}`)}
      />

      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--ds-sand)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
