"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  Sparkles,
  Package,
  Layers,
  Database,
  Sliders,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  RefreshCw,
  ArrowLeft,
  X,
  Eye,
  Tag,
  Palette
} from "lucide-react";
import { OOTDRecommendation, OutfitItem } from "@/lib/types";
import { FashionCatalogItem } from "@/lib/fashion-catalog-data";
import { 
  getAllAdminPresets, 
  saveAdminPreset, 
  deleteAdminPreset,
  getAllAdminCatalog,
  saveAdminCatalogItem,
  deleteAdminCatalogItem,
  resetCatalogToFactory,
  getAdminAISettings,
  saveAdminAISettings,
  AISettingsConfig,
  DEFAULT_AI_SETTINGS
} from "@/lib/cms-store";
import { isSupabaseConfigured, supabaseUrl } from "@/lib/supabase";
import Toast, { ToastMessage } from "@/components/Toast";

export default function AdminCMSPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<"presets" | "catalog" | "ai" | "database">("presets");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Presets State
  const [presets, setPresets] = useState<OOTDRecommendation[]>([]);
  const [presetSearch, setPresetSearch] = useState("");
  const [editingPreset, setEditingPreset] = useState<OOTDRecommendation | null>(null);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  // Catalog State
  const [catalog, setCatalog] = useState<FashionCatalogItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("Semua");
  const [editingCatalogItem, setEditingCatalogItem] = useState<FashionCatalogItem | null>(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  // AI Settings State
  const [aiSettings, setAiSettings] = useState<AISettingsConfig>(DEFAULT_AI_SETTINGS);

  // Database JSON Import State
  const [importJson, setImportJson] = useState("");
  const [importType, setImportType] = useState<"presets" | "catalog">("presets");

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check existing session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("looku_admin_authenticated");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const refreshAllData = () => {
    setPresets(getAllAdminPresets());
    setCatalog(getAllAdminCatalog());
    setAiSettings(getAdminAISettings());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();

      const handleUpdate = () => refreshAllData();
      window.addEventListener("looku_presets_updated", handleUpdate);
      window.addEventListener("looku_catalog_updated", handleUpdate);
      window.addEventListener("looku_ai_settings_updated", handleUpdate);

      return () => {
        window.removeEventListener("looku_presets_updated", handleUpdate);
        window.removeEventListener("looku_catalog_updated", handleUpdate);
        window.removeEventListener("looku_ai_settings_updated", handleUpdate);
      };
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: looku2026 or admin
    if (pinInput.trim() === "looku2026" || pinInput.trim() === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("looku_admin_authenticated", "true");
      setPinError(false);
      addToast({
        title: "Akses Diberikan",
        description: "Selamat datang di Atelier Fashion CMS Dashboard.",
        type: "success",
      });
    } else {
      setPinError(true);
      addToast({
        title: "PIN Salah",
        description: "Gunakan PIN default: looku2026",
        type: "error",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("looku_admin_authenticated");
    setPinInput("");
  };

  // ==========================================
  // PRESET ACTIONS
  // ==========================================
  const handleOpenNewPreset = () => {
    setEditingPreset({
      id: `custom_preset_${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: "Nama Formula OOTD Baru",
      tagline: "Perpaduan bahan adem untuk iklim tropis 33°C",
      overallVibe: "Earthy Minimalist",
      comfortRating: 4.9,
      affordabilityRating: 4.8,
      modestFriendly: true,
      skinToneMatch: "Sangat cocok untuk tone kulit Sawo Matang dan Kuning Langsat.",
      whyItWorks: "Bahan katun rayon twill dan linen memberikan sirkulasi udara maksimal di cuaca terik.",
      stylingTip: "Gunakan french-tuck pada bagian depan atasan untuk proporsi tubuh yang lebih jenjang.",
      colorPalette: [
        { name: "Sage Green", hex: "#7A8471" },
        { name: "Broken White", hex: "#F4EFE6" },
        { name: "Warm Sand", hex: "#D7CABC" },
        { name: "Terracotta", hex: "#BA5D38" },
      ],
      items: [
        {
          category: "atasan",
          name: "Kemeja Linen Crinkle Relaxed",
          material: "Linen Euro Berkualitas",
          color: "Sage Green",
          colorHex: "#7A8471",
          estimatedPrice: "Rp 85.000 - 110.000",
          shopeeQuery: "kemeja linen sage green oversized wanita",
          tokopediaQuery: "kemeja linen crinkle sage green",
        },
        {
          category: "bawahan",
          name: "Celana Kulot Loose Highwaist",
          material: "Katun Twill Flowy",
          color: "Broken White",
          colorHex: "#F4EFE6",
          estimatedPrice: "Rp 95.000 - 125.000",
          shopeeQuery: "celana kulot highwaist broken white",
          tokopediaQuery: "kulot loose broken white wanita",
        },
        {
          category: "outer_hijab",
          name: "Pashmina Ceruty Babydoll",
          material: "Ceruty Premium",
          color: "Warm Sand",
          colorHex: "#D7CABC",
          estimatedPrice: "Rp 35.000 - 55.000",
          shopeeQuery: "pashmina ceruty babydoll warm sand",
          tokopediaQuery: "pashmina ceruty sand",
        },
        {
          category: "sepatu",
          name: "Pointed Loafers / Mules",
          material: "Kulit Sintetis Vegan",
          color: "Warm Sand",
          colorHex: "#D7CABC",
          estimatedPrice: "Rp 120.000 - 160.000",
          shopeeQuery: "mules loafers wanita cream",
          tokopediaQuery: "loafers pointed mules wanita",
        },
        {
          category: "aksesoris",
          name: "Canvas Tote Bag Minimalist",
          material: "Canvas Katun Tebal",
          color: "Broken White",
          colorHex: "#F4EFE6",
          estimatedPrice: "Rp 45.000 - 75.000",
          shopeeQuery: "tote bag kanvas broken white minimalist",
          tokopediaQuery: "tote bag canvas broken white",
        },
      ],
    });
    setIsPresetModalOpen(true);
  };

  const handleSavePresetForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPreset) return;
    saveAdminPreset(editingPreset);
    setIsPresetModalOpen(false);
    refreshAllData();
    addToast({
      title: "Formula OOTD Disimpan!",
      description: `${editingPreset.title} telah diperbarui di database.`,
      type: "success",
    });
  };

  const handleDeletePreset = (id: string, title: string) => {
    if (confirm(`Apakah kamu yakin ingin menghapus formula "${title}"?`)) {
      deleteAdminPreset(id);
      refreshAllData();
      addToast({
        title: "Formula Dihapus",
        description: title,
        type: "info",
      });
    }
  };

  // ==========================================
  // CATALOG ACTIONS
  // ==========================================
  const handleOpenNewCatalogItem = () => {
    setEditingCatalogItem({
      id: `custom_cat_${Date.now()}`,
      name: "Blouse Katun Rayon Flowy - Sage Green",
      brandName: "Lokal Atelier",
      brandTier: "hemat",
      category: "atasan",
      gender: "female",
      priceMin: 85000,
      priceMax: 110000,
      material: "Katun Rayon Twill",
      breathability: "96.5%",
      colorName: "Sage Green",
      colorHex: "#7A8471",
      suitableSkinTones: ["fair", "light", "medium", "tan"],
      shopeeQuery: "blouse katun rayon sage green flowy",
      tokopediaQuery: "blouse rayon twill sage green",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
      isModestFriendly: true,
    });
    setIsCatalogModalOpen(true);
  };

  const handleSaveCatalogForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatalogItem) return;
    saveAdminCatalogItem(editingCatalogItem);
    setIsCatalogModalOpen(false);
    refreshAllData();
    addToast({
      title: "Produk Katalog Disimpan!",
      description: `${editingCatalogItem.name} berhasil diperbarui.`,
      type: "success",
    });
  };

  const handleDeleteCatalog = (id: string, name: string) => {
    if (confirm(`Hapus produk "${name}" dari katalog?`)) {
      deleteAdminCatalogItem(id);
      refreshAllData();
      addToast({
        title: "Produk Dihapus",
        description: name,
        type: "info",
      });
    }
  };

  // ==========================================
  // EXPORT / IMPORT ACTIONS
  // ==========================================
  const handleExportPresetsJson = () => {
    const data = getAllAdminPresets();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `looku-presets-database-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: "Presets Diekspor!", description: "File JSON database berhasil diunduh.", type: "success" });
  };

  const handleExportCatalogJson = () => {
    const data = getAllAdminCatalog();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `looku-catalog-300-database-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: "Katalog Diekspor!", description: "Database produk berhasil diunduh.", type: "success" });
  };

  const handleImportSubmit = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (Array.isArray(parsed)) {
        if (importType === "presets") {
          const dict: Record<string, OOTDRecommendation> = {};
          parsed.forEach((p: OOTDRecommendation) => {
            if (p.id) dict[p.id] = p;
          });
          localStorage.setItem("looku_custom_presets", JSON.stringify(dict));
          window.dispatchEvent(new Event("looku_presets_updated"));
          addToast({ title: "Presets Berhasil Diimpor!", description: `${parsed.length} formula dimuat.`, type: "success" });
        } else {
          localStorage.setItem("looku_custom_catalog", JSON.stringify(parsed));
          window.dispatchEvent(new Event("looku_catalog_updated"));
          addToast({ title: "Katalog Berhasil Diimpor!", description: `${parsed.length} produk dimuat.`, type: "success" });
        }
        setImportJson("");
        refreshAllData();
      } else {
        addToast({ title: "Format Salah", description: "Format JSON harus berupa Array [...]", type: "error" });
      }
    } catch {
      addToast({ title: "Gagal Parsing JSON", description: "Pastikan sintaks JSON valid.", type: "error" });
    }
  };

  // Filtered lists
  const filteredPresets = presets.filter((p) => {
    const q = presetSearch.toLowerCase();
    return (
      (p.title || "").toLowerCase().includes(q) ||
      (p.overallVibe || "").toLowerCase().includes(q) ||
      (p.tagline || "").toLowerCase().includes(q)
    );
  });

  const filteredCatalog = catalog.filter((item) => {
    const matchesCategory = catalogCategory === "Semua" || item.category === catalogCategory;
    const q = catalogSearch.toLowerCase();
    const matchesSearch =
      (item.name || "").toLowerCase().includes(q) ||
      (item.brandName || "").toLowerCase().includes(q) ||
      (item.material || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // ==========================================
  // RENDER LOGIN GATE IF NOT AUTHENTICATED
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 flex flex-col justify-between p-6">
        <header className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="font-serif italic font-bold text-2xl text-[#181A18] flex items-baseline">
            look<span className="text-terracotta-500 not-italic">.</span>u
            <span className="font-mono text-[9px] not-italic ml-2 uppercase font-bold text-sand-500 tracking-wider">
              CMS Login
            </span>
          </Link>
          <Link href="/" className="text-xs font-bold text-sand-500 hover:text-charcoal-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
        </header>

        <main className="max-w-md mx-auto w-full py-12 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-charcoal-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-terracotta-600">
                ATELIER MANAGEMENT PORTAL
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                Akses CMS Database
              </h1>
              <p className="text-xs text-sand-500">
                Masukkan PIN Admin untuk mengelola formula OOTD, katalog 300+ produk, dan tuning AI.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase text-charcoal-900">
                  PIN Keamanan Admin:
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Masukkan PIN (default: looku2026)"
                  className="w-full px-4 py-3 rounded-xl bg-sand-50 border border-sand-300 text-sm text-charcoal-900 font-mono focus:outline-none focus:border-terracotta-500 transition-colors"
                />
                {pinError && (
                  <p className="text-[11px] text-rose-500 font-mono">
                    PIN salah. Gunakan PIN default: <b>looku2026</b>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Unlock className="w-4 h-4" />
                <span>Buka Dashboard CMS ➔</span>
              </button>
            </form>

            <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-left text-[11px] text-sand-500">
              💡 <b>Info Akses:</b> PIN default pengembang adalah <code>looku2026</code>.
            </div>
          </div>
        </main>

        <footer className="text-center font-mono text-xs text-sand-500">
          LOOK.U ATELIER CMS • SECURE FASHION REPOSITORY
        </footer>
        <Toast toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // ==========================================
  // RENDER FULL CMS DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 pb-20">
      {/* CMS Header */}
      <header className="sticky top-0 z-40 bg-[#181A18] text-white border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif italic font-bold text-2xl text-white flex items-baseline">
              look<span className="text-terracotta-500 not-italic">.</span>u
              <span className="font-mono text-[9px] not-italic ml-2 uppercase font-bold text-amber-400 tracking-wider">
                ATELIER CMS
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2 border-l border-white/20 pl-4 text-xs font-mono text-sand-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isSupabaseConfigured ? "Supabase Cloud DB Connected" : "Local-First Storage Active"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-300 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "presets", label: `Formula OOTD (${presets.length})`, icon: Sparkles },
              { id: "catalog", label: `Katalog Busana (${catalog.length})`, icon: Package },
              { id: "ai", label: "Tuning AI & Prompt", icon: Sliders },
              { id: "database", label: "Backup & JSON Import", icon: Database },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-charcoal-900 text-white shadow-sm"
                      : "bg-white hover:bg-sand-100 text-charcoal-900 border border-sand-300"
                  }`}
                >
                  <Icon className="w-4 h-4 text-terracotta-500" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "presets" && (
              <button
                onClick={handleOpenNewPreset}
                className="py-2.5 px-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Formula OOTD</span>
              </button>
            )}

            {activeTab === "catalog" && (
              <button
                onClick={handleOpenNewCatalogItem}
                className="py-2.5 px-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk Katalog</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: FORMULA OOTD PRESETS CMS                              */}
        {/* ============================================================ */}
        {activeTab === "presets" && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="text"
                value={presetSearch}
                onChange={(e) => setPresetSearch(e.target.value)}
                placeholder="Cari formula berdasarkan nama, vibe, atau acara..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-sand-300 text-xs text-charcoal-900 focus:outline-none focus:border-terracotta-500 shadow-2xs"
              />
            </div>

            {/* Presets Table Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-5 rounded-2xl bg-white border border-[#E8DFD1] shadow-tactile flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200 uppercase">
                        {preset.overallVibe}
                      </span>
                      <span className="text-[10px] font-mono text-sand-400">
                        {preset.items?.length || 5} Items
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-charcoal-900 leading-snug">
                      {preset.title}
                    </h3>
                    <p className="text-xs text-sand-500 line-clamp-2">
                      {preset.tagline}
                    </p>

                    {/* Swatches */}
                    {preset.colorPalette && (
                      <div className="flex items-center gap-1.5 pt-1">
                        {preset.colorPalette.map((col, idx) => (
                          <div
                            key={idx}
                            title={`${col.name} (${col.hex})`}
                            className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                            style={{ backgroundColor: col.hex }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-sand-400">
                      ID: #{preset.id.slice(-6)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingPreset({ ...preset });
                          setIsPresetModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-charcoal-900 transition-colors"
                        title="Edit Formula"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-terracotta-600" />
                      </button>
                      <button
                        onClick={() => handleDeletePreset(preset.id, preset.title)}
                        className="p-1.5 rounded-lg bg-sand-100 hover:bg-rose-50 text-sand-400 hover:text-rose-600 transition-colors"
                        title="Hapus Formula"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: MASTER CATALOG 300+ CMS                               */}
        {/* ============================================================ */}
        {activeTab === "catalog" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Cari busana berdasarkan nama, brand, atau bahan..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-sand-300 text-xs text-charcoal-900 focus:outline-none focus:border-terracotta-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: "Semua", label: "Semua" },
                  { id: "atasan", label: "Atasan" },
                  { id: "bawahan", label: "Bawahan" },
                  { id: "outer_hijab", label: "Hijab / Outer" },
                  { id: "sepatu", label: "Sepatu" },
                  { id: "aksesoris", label: "Aksesoris" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCatalogCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      catalogCategory === cat.id
                        ? "bg-charcoal-900 text-white"
                        : "bg-white hover:bg-sand-100 text-charcoal-900 border border-sand-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCatalog.slice(0, 48).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-[#E8DFD1] shadow-tactile flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-sand-500 bg-sand-100 px-2 py-0.5 rounded-full uppercase">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-bold text-terracotta-600 font-mono">
                        Rp {item.priceMin.toLocaleString("id-ID")} - {item.priceMax.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-charcoal-900 leading-snug line-clamp-2">
                      {item.name}
                    </div>

                    <div className="text-[10px] text-sand-500 font-mono">
                      Brand: <span className="font-bold text-charcoal-900">{item.brandName}</span> • {item.material}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sand-200 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-sand-400">{item.colorName}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingCatalogItem({ ...item });
                          setIsCatalogModalOpen(true);
                        }}
                        className="p-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-charcoal-900"
                        title="Edit Produk"
                      >
                        <Edit3 className="w-3 h-3 text-terracotta-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCatalog(item.id, item.name)}
                        className="p-1 rounded-lg bg-sand-100 hover:bg-rose-50 text-sand-400 hover:text-rose-600"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCatalog.length > 48 && (
              <p className="text-center text-xs font-mono text-sand-500 pt-4">
                Menampilkan 48 dari {filteredCatalog.length} item. Gunakan pencarian untuk melihat item spesifik.
              </p>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: AI STYLIST TUNER                                      */}
        {/* ============================================================ */}
        {activeTab === "ai" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-6 max-w-4xl">
            <div className="space-y-1">
              <h2 className="font-serif font-bold text-xl text-charcoal-900">
                Tuning Otak & Prompt AI Stylist (Gemini 2.5 Flash)
              </h2>
              <p className="text-xs text-sand-500">
                Atur instruksi dasar gaya, kriteria bahan adem 33°C, dan parameter kehangatan rekomendasi busana.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-900 uppercase font-mono">
                  System Instruction Prompt:
                </label>
                <textarea
                  value={aiSettings.systemPrompt}
                  onChange={(e) => setAiSettings({ ...aiSettings, systemPrompt: e.target.value })}
                  rows={6}
                  className="w-full p-4 rounded-2xl bg-sand-50 border border-sand-300 text-xs text-charcoal-900 font-mono focus:outline-none focus:border-terracotta-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Suhu Kreativitas (Temperature):</span>
                    <span className="font-mono text-terracotta-600">{aiSettings.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={aiSettings.temperature}
                    onChange={(e) => setAiSettings({ ...aiSettings, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-terracotta-500"
                  />
                  <p className="text-[10px] text-sand-500">
                    Nilai lebih rendah (0.4) menghasilkan rekomendasi lebih terukur & realistis.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-2">
                  <label className="text-xs font-bold block">Default Iklim Standar:</label>
                  <input
                    type="text"
                    value={aiSettings.defaultClimate}
                    onChange={(e) => setAiSettings({ ...aiSettings, defaultClimate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-sand-300 text-xs font-bold text-charcoal-900"
                  />
                  <p className="text-[10px] text-sand-500">
                    Standar default iklim Indonesia untuk acuan sirkulasi kain.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  saveAdminAISettings(aiSettings);
                  addToast({ title: "Pengaturan AI Disimpan!", description: "Konfigurasi gaya telah diperbarui.", type: "success" });
                }}
                className="py-3 px-6 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Konfigurasi AI</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: DATABASE BACKUP & JSON IMPORTER                       */}
        {/* ============================================================ */}
        {activeTab === "database" && (
          <div className="space-y-6 max-w-4xl">
            {/* Export Cards */}
            <div className="p-6 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-charcoal-900">
                  Ekspor Database Resmi (.JSON)
                </h3>
                <p className="text-xs text-sand-500">
                  Unduh salinan cadangan lengkap data rekomendasi dan katalog pakaian untuk arsip atau migrasi.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportPresetsJson}
                  className="py-3 px-5 rounded-2xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xs transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Ekspor Formula OOTD (.json)</span>
                </button>

                <button
                  onClick={handleExportCatalogJson}
                  className="py-3 px-5 rounded-2xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xs transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Ekspor Katalog 300+ (.json)</span>
                </button>
              </div>
            </div>

            {/* Import Area */}
            <div className="p-6 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-charcoal-900">
                  Impor Data Baru Massal (JSON Array)
                </h3>
                <p className="text-xs text-sand-500">
                  Perbarui ribuan pakaian atau puluhan formula OOTD sekaligus dengan menempelkan data JSON.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importType"
                    checked={importType === "presets"}
                    onChange={() => setImportType("presets")}
                    className="accent-terracotta-500"
                  />
                  <span>Impor Formula OOTD</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importType"
                    checked={importType === "catalog"}
                    onChange={() => setImportType("catalog")}
                    className="accent-terracotta-500"
                  />
                  <span>Impor Katalog Busana</span>
                </label>
              </div>

              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='[{"id": "ootd_01", "title": "...", "items": [...]}]'
                rows={6}
                className="w-full p-3 rounded-2xl bg-sand-50 border border-sand-300 text-xs font-mono text-charcoal-900 focus:outline-none focus:border-terracotta-500"
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={handleImportSubmit}
                  disabled={!importJson.trim()}
                  className="py-3 px-6 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Proses & Terapkan Data</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm("Reset seluruh katalog dan presets kembali ke data master bawaan pabrik?")) {
                      resetCatalogToFactory();
                      refreshAllData();
                      addToast({ title: "Database Direset", description: "Kembali ke data master bawaan pabrik.", type: "info" });
                    }
                  }}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                >
                  Reset ke Data Master Pabrik
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* EDIT PRESET FORM MODAL                                       */}
      {/* ============================================================ */}
      {isPresetModalOpen && editingPreset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-300 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <h3 className="font-serif font-bold text-xl text-charcoal-900">
                Edit Formula OOTD
              </h3>
              <button onClick={() => setIsPresetModalOpen(false)} className="p-1 rounded-full hover:bg-sand-100">
                <X className="w-5 h-5 text-charcoal-900" />
              </button>
            </div>

            <form onSubmit={handleSavePresetForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold font-mono">Judul Formula OOTD:</label>
                  <input
                    type="text"
                    required
                    value={editingPreset.title}
                    onChange={(e) => setEditingPreset({ ...editingPreset, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold font-mono">Overall Vibe:</label>
                  <input
                    type="text"
                    required
                    value={editingPreset.overallVibe}
                    onChange={(e) => setEditingPreset({ ...editingPreset, overallVibe: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold font-mono">Tagline Catchy:</label>
                <input
                  type="text"
                  required
                  value={editingPreset.tagline}
                  onChange={(e) => setEditingPreset({ ...editingPreset, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold font-mono">Analisis Kecocokan Warna Kulit (Skin Tone Match):</label>
                <textarea
                  rows={2}
                  value={editingPreset.skinToneMatch}
                  onChange={(e) => setEditingPreset({ ...editingPreset, skinToneMatch: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300"
                />
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3 pt-2">
                <div className="font-bold font-mono text-sm uppercase text-terracotta-600 border-b pb-1">
                  Breakdown 5 Item Busana & Kata Kunci Toko:
                </div>

                {editingPreset.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-sand-50 rounded-xl border border-sand-200 space-y-2">
                    <div className="font-bold uppercase text-[10px] text-sand-500">
                      Item #{idx + 1} ({item.category})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Nama Pakaian"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...editingPreset.items];
                          updated[idx].name = e.target.value;
                          setEditingPreset({ ...editingPreset, items: updated });
                        }}
                        className="p-2 rounded-lg bg-white border border-sand-300 font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Bahan Kain"
                        value={item.material}
                        onChange={(e) => {
                          const updated = [...editingPreset.items];
                          updated[idx].material = e.target.value;
                          setEditingPreset({ ...editingPreset, items: updated });
                        }}
                        className="p-2 rounded-lg bg-white border border-sand-300"
                      />
                      <input
                        type="text"
                        placeholder="Estimasi Harga (misal: Rp 85.000)"
                        value={item.estimatedPrice}
                        onChange={(e) => {
                          const updated = [...editingPreset.items];
                          updated[idx].estimatedPrice = e.target.value;
                          setEditingPreset({ ...editingPreset, items: updated });
                        }}
                        className="p-2 rounded-lg bg-white border border-sand-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Kata Kunci Pencarian Shopee"
                        value={item.shopeeQuery}
                        onChange={(e) => {
                          const updated = [...editingPreset.items];
                          updated[idx].shopeeQuery = e.target.value;
                          setEditingPreset({ ...editingPreset, items: updated });
                        }}
                        className="p-2 rounded-lg bg-white border border-sand-300 font-mono text-[11px]"
                      />
                      <input
                        type="text"
                        placeholder="Kata Kunci Pencarian Tokopedia"
                        value={item.tokopediaQuery}
                        onChange={(e) => {
                          const updated = [...editingPreset.items];
                          updated[idx].tokopediaQuery = e.target.value;
                          setEditingPreset({ ...editingPreset, items: updated });
                        }}
                        className="p-2 rounded-lg bg-white border border-sand-300 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setIsPresetModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-900 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold uppercase tracking-wider"
                >
                  Simpan Formula OOTD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EDIT CATALOG ITEM MODAL                                      */}
      {/* ============================================================ */}
      {isCatalogModalOpen && editingCatalogItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-300 my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <h3 className="font-serif font-bold text-xl text-charcoal-900">
                Edit Produk Katalog
              </h3>
              <button onClick={() => setIsCatalogModalOpen(false)} className="p-1 rounded-full hover:bg-sand-100">
                <X className="w-5 h-5 text-charcoal-900" />
              </button>
            </div>

            <form onSubmit={handleSaveCatalogForm} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold font-mono">Nama Produk Busana:</label>
                <input
                  type="text"
                  required
                  value={editingCatalogItem.name}
                  onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold font-mono">Nama Brand:</label>
                  <input
                    type="text"
                    required
                    value={editingCatalogItem.brandName}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, brandName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold font-mono">Harga Min (Rp):</label>
                    <input
                      type="number"
                      required
                      value={editingCatalogItem.priceMin}
                      onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, priceMin: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold font-mono">Harga Max (Rp):</label>
                    <input
                      type="number"
                      required
                      value={editingCatalogItem.priceMax}
                      onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, priceMax: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold font-mono">Kategori:</label>
                  <select
                    value={editingCatalogItem.category}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300"
                  >
                    <option value="atasan">Atasan</option>
                    <option value="bawahan">Bawahan</option>
                    <option value="outer_hijab">Outer / Hijab</option>
                    <option value="sepatu">Sepatu</option>
                    <option value="aksesoris">Aksesoris</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold font-mono">Bahan Kain:</label>
                  <input
                    type="text"
                    required
                    value={editingCatalogItem.material}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, material: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold font-mono">Kata Kunci Pencarian Shopee:</label>
                <input
                  type="text"
                  required
                  value={editingCatalogItem.shopeeQuery}
                  onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, shopeeQuery: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold font-mono">Kata Kunci Pencarian Tokopedia:</label>
                <input
                  type="text"
                  required
                  value={editingCatalogItem.tokopediaQuery}
                  onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, tokopediaQuery: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setIsCatalogModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-900 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold uppercase tracking-wider"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
