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
  Palette,
  TrendingUp,
  MousePointerClick,
  Star,
  Link as LinkIcon
} from "lucide-react";
import { OOTDRecommendation, OutfitItem, TrendingLook } from "@/lib/types";
import { FashionCatalogItem } from "@/lib/presets";
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
  DEFAULT_AI_SETTINGS,
  getAllAdminLookbook,
  saveAdminLookbookItem,
  saveBulkAdminLookbook,
  deleteAdminLookbookItem,
  exportLookbookToCsv,
  parseCsvToTrendingLooks,
  getAdminDashboardMetrics,
  AdminDashboardMetrics,
  validateLookbookItem
} from "@/lib/cms-store";
import { isSupabaseConfigured, supabaseUrl } from "@/lib/supabase";
import Toast, { ToastMessage } from "@/components/Toast";

export default function AdminCMSPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<"lookbook" | "presets" | "catalog" | "ai" | "database">("lookbook");
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Lookbook Feed State (Admin Curated & Direct Shopee URLs)
  const [lookbookItems, setLookbookItems] = useState<TrendingLook[]>([]);
  const [lookbookSearch, setLookbookSearch] = useState("");
  const [lookbookCategoryFilter, setLookbookCategoryFilter] = useState("verified");
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [editingLook, setEditingLook] = useState<TrendingLook | null>(null);
  const [isLookModalOpen, setIsLookModalOpen] = useState(false);
  const [isExtractingImage, setIsExtractingImage] = useState(false);

  const handleImageUrlChange = (val: string) => {
    let clean = val.trim();
    // Auto-decode google image search url
    if (clean.includes("google.") && clean.includes("/imgres")) {
      try {
        const u = new URL(clean);
        const img = u.searchParams.get("imgurl");
        if (img) clean = decodeURIComponent(img);
      } catch {}
    }
    if (editingLook) {
      setEditingLook({ ...editingLook, image: clean });
    }
  };

  const handleAutoExtractImage = async () => {
    if (!editingLook?.image) return;
    setIsExtractingImage(true);
    try {
      const res = await fetch(`/api/extract-image?url=${encodeURIComponent(editingLook.image)}`);
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setEditingLook({ ...editingLook, image: data.imageUrl });
        addToast({
          title: "Foto Berhasil Ditemukan!",
          description: `Sumber gambar ${data.source || "Web"} siap digunakan.`,
          type: "success",
        });
      } else {
        addToast({
          title: "Gagal Mengambil Gambar",
          description: data.error || "Gunakan cara Klik Kanan pada foto lalu pilih 'Salin Alamat Gambar'.",
          type: "error",
        });
      }
    } catch {
      addToast({
        title: "Koneksi Gagal",
        description: "Gunakan cara Klik Kanan pada foto lalu pilih 'Salin Alamat Gambar'.",
        type: "error",
      });
    } finally {
      setIsExtractingImage(false);
    }
  };

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
  const [importType, setImportType] = useState<"presets" | "catalog" | "lookbook">("lookbook");

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
    setLookbookItems(getAllAdminLookbook());
    setMetrics(getAdminDashboardMetrics());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();

      const handleUpdate = () => refreshAllData();
      window.addEventListener("looku_presets_updated", handleUpdate);
      window.addEventListener("looku_catalog_updated", handleUpdate);
      window.addEventListener("looku_ai_settings_updated", handleUpdate);
      window.addEventListener("looku_lookbook_updated", handleUpdate);

      return () => {
        window.removeEventListener("looku_presets_updated", handleUpdate);
        window.removeEventListener("looku_catalog_updated", handleUpdate);
        window.removeEventListener("looku_ai_settings_updated", handleUpdate);
        window.removeEventListener("looku_lookbook_updated", handleUpdate);
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
  // LOOKBOOK CURATION ACTIONS (CRUD & SHOPEE)
  // ==========================================
  const handleOpenNewLook = () => {
    const newId = `custom_look_${Date.now()}`;
    setEditingLook({
      id: newId,
      title: "Setelan Tropis Minimalis",
      tag: "SIGNATURE LOOK",
      category: "Campus Hijab",
      vibe: "Earthy Minimalist",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      skinToneRecommendation: "Sawo Matang & Kuning Langsat",
      priceRange: "Rp 210.000 - Rp 295.000",
      shopeeUrl: "",
      isGoldenSignature: true,
      likes: 154,
      likesCount: 154,
      outfit: {
        id: `rec_${newId}`,
        createdAt: new Date().toISOString(),
        title: "Setelan Tropis Minimalis",
        tagline: "Perpaduan bahan katun adem untuk iklim tropis 33°C",
        overallVibe: "Earthy Minimalist",
        comfortRating: 4.9,
        affordabilityRating: 4.8,
        modestFriendly: true,
        skinToneMatch: "Sangat cocok untuk tone kulit Sawo Matang dan Kuning Langsat.",
        whyItWorks: "Bahan katun rayon dan linen memberikan sirkulasi udara maksimal di cuaca terik.",
        stylingTip: "Gunakan french-tuck pada bagian depan atasan untuk proporsi tubuh yang lebih jenjang.",
        isGoldenSignature: true,
        heroImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        shopeeUrl: "",
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
            shopeeUrl: "",
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
            shopeeUrl: "",
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
            shopeeUrl: "",
            shopeeQuery: "pashmina ceruty babydoll warm sand",
            tokopediaQuery: "pashmina ceruty sand",
          },
          {
            category: "sepatu",
            name: "Pointed Mules / Loafers Kulit",
            material: "Kulit Vegan",
            color: "Warm Sand",
            colorHex: "#D7CABC",
            estimatedPrice: "Rp 120.000 - 160.000",
            shopeeUrl: "",
            shopeeQuery: "mules loafers pointed wanita cream",
            tokopediaQuery: "loafers pointed mules wanita",
          },
        ],
      },
    });
    setIsLookModalOpen(true);
  };

  const handleEditLook = (look: TrendingLook) => {
    // Clone deeply to avoid in-place mutations
    const cloned: TrendingLook = JSON.parse(JSON.stringify(look));
    if (!cloned.outfit) {
      cloned.outfit = {
        id: `rec_${cloned.id}`,
        createdAt: new Date().toISOString(),
        title: cloned.title,
        tagline: cloned.title,
        overallVibe: cloned.vibe,
        comfortRating: 4.9,
        affordabilityRating: 4.8,
        modestFriendly: cloned.category.toLowerCase().includes("hijab"),
        skinToneMatch: cloned.skinToneRecommendation,
        whyItWorks: "Bahan adem tropis.",
        stylingTip: "Padukan dengan aksesoris minimalis.",
        heroImage: cloned.image,
        shopeeUrl: cloned.shopeeUrl || "",
        colorPalette: [
          { name: "Neutral 1", hex: "#7A8471" },
          { name: "Neutral 2", hex: "#F4EFE6" },
        ],
        items: [
          { category: "atasan", name: "Atasan Casual", material: "Katun", color: "Netral", colorHex: "#FFFFFF", estimatedPrice: "Rp 85.000", shopeeUrl: "", shopeeQuery: "atasan casual wanita", tokopediaQuery: "atasan casual" },
          { category: "bawahan", name: "Bawahan Nyaman", material: "Twill", color: "Netral", colorHex: "#000000", estimatedPrice: "Rp 95.000", shopeeUrl: "", shopeeQuery: "bawahan celana kulot", tokopediaQuery: "celana kulot" },
          { category: "outer_hijab", name: "Outer / Hijab", material: "Ceruty", color: "Netral", colorHex: "#D7CABC", estimatedPrice: "Rp 45.000", shopeeUrl: "", shopeeQuery: "outer hijab pashmina", tokopediaQuery: "pashmina ceruty" },
          { category: "sepatu", name: "Sepatu Rapi", material: "Kulit Vegan", color: "Netral", colorHex: "#D7CABC", estimatedPrice: "Rp 125.000", shopeeUrl: "", shopeeQuery: "sepatu loafers mules", tokopediaQuery: "loafers mules" },
        ],
      };
    }
    // Ensure all 4 items exist
    if (!cloned.outfit.items || cloned.outfit.items.length < 4) {
      const existing = cloned.outfit.items || [];
      const cats: Array<"atasan" | "bawahan" | "outer_hijab" | "sepatu"> = ["atasan", "bawahan", "outer_hijab", "sepatu"];
      cats.forEach((cat) => {
        if (!existing.some((it) => it.category === cat)) {
          existing.push({
            category: cat,
            name: `Item ${cat}`,
            material: "Katun Premium",
            color: "Netral",
            colorHex: "#F4EFE6",
            estimatedPrice: "Rp 75.000",
            shopeeUrl: "",
            shopeeQuery: `${cat} casual`,
            tokopediaQuery: `${cat} casual`,
          });
        }
      });
      cloned.outfit.items = existing;
    }
    setEditingLook(cloned);
    setIsLookModalOpen(true);
  };

  const handleSaveLookForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLook) return;

    const lookToSave: TrendingLook = {
      ...editingLook,
      outfit: {
        ...(editingLook.outfit || ({} as any)),
        id: editingLook.outfit?.id || `rec_${editingLook.id}`,
        createdAt: editingLook.outfit?.createdAt || new Date().toISOString(),
        title: editingLook.title,
        tagline: editingLook.outfit?.tagline || editingLook.title,
        overallVibe: editingLook.vibe,
        comfortRating: editingLook.outfit?.comfortRating || 4.9,
        affordabilityRating: editingLook.outfit?.affordabilityRating || 4.8,
        modestFriendly:
          editingLook.category.toLowerCase().includes("hijab") ||
          editingLook.tag.toLowerCase().includes("hijab") ||
          editingLook.outfit?.modestFriendly ||
          false,
        skinToneMatch: editingLook.skinToneRecommendation,
        isGoldenSignature: editingLook.isGoldenSignature,
        heroImage: editingLook.image,
        shopeeUrl: editingLook.shopeeUrl,
        items: editingLook.outfit?.items || [],
        colorPalette: editingLook.outfit?.colorPalette || [
          { name: "Neutral 1", hex: "#7A8471" },
          { name: "Neutral 2", hex: "#F4EFE6" },
        ],
      },
    };

    saveAdminLookbookItem(lookToSave);
    setIsLookModalOpen(false);
    refreshAllData();
    addToast({
      title: "Lookbook Berhasil Disimpan!",
      description: `"${editingLook.title}" kini aktif di Lookbook & Studio.`,
      type: "success",
    });
  };

  const handleDeleteLook = (id: string, title: string) => {
    if (confirm(`Hapus outfit kurasi "${title}" dari Lookbook & Studio?`)) {
      deleteAdminLookbookItem(id);
      refreshAllData();
      addToast({
        title: "Outfit Lookbook Dihapus",
        description: `"${title}" telah dihapus dari publik.`,
        type: "info",
      });
    }
  };

  const handleSyncGoogleSheets = async () => {
    if (!googleSheetUrl.trim()) return;
    setIsSyncingSheets(true);
    try {
      const res = await fetch("/api/sync-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: googleSheetUrl }),
      });
      const data = await res.json();
      if (data.success && data.looks) {
        saveBulkAdminLookbook(data.looks);
        refreshAllData();
        addToast({
          title: "Google Sheets Berhasil Disinkronkan!",
          description: data.message,
          type: "success",
        });
      } else {
        addToast({
          title: "Gagal Sinkronisasi",
          description: data.error || "Pastikan Google Sheet berstatus Public (Siapa saja dengan link dapat melihat).",
          type: "error",
        });
      }
    } catch (err: any) {
      addToast({
        title: "Koneksi Gagal",
        description: err.message || "Gagal menghubungi server untuk sinkronisasi Google Sheets.",
        type: "error",
      });
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleToggleVerifyLook = (look: TrendingLook) => {
    const currentlyVerified = look.is_verified !== false && look.is_published !== false;
    const nextState = !currentlyVerified;
    if (nextState) {
      const check = validateLookbookItem(look);
      if (!check.isValid) {
        addToast({
          title: "Validasi Gagal Sebelum Publish",
          description: check.warnings.join(" "),
          type: "error",
        });
        return;
      }
    }
    const updatedLook: TrendingLook = {
      ...look,
      is_verified: nextState,
      is_published: nextState,
      outfit: {
        ...look.outfit,
        is_verified: nextState,
        is_published: nextState,
      },
    };
    saveAdminLookbookItem(updatedLook);
    refreshAllData();
    addToast({
      title: nextState ? "Outfit Diverifikasi & Tayang!" : "Outfit Disembunyikan ke Draft",
      description: nextState
        ? `"${look.title}" kini tampil di Lookbook publik.`
        : `"${look.title}" disembunyikan dari publik (tersimpan di Draft).`,
      type: nextState ? "success" : "info",
    });
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

  const handleExportLookbookCsv = () => {
    const csvContent = exportLookbookToCsv(lookbookItems);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `looku-lookbook-dataset-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: "Lookbook Diekspor!", description: `${lookbookItems.length} outfit siap dibuka di Excel.`, type: "success" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setImportJson(res);
        if (file.name.toLowerCase().endsWith(".csv")) {
          setImportType("lookbook");
        }
        addToast({
          title: "File Berhasil Dimuat",
          description: `File "${file.name}" siap diproses. Klik tombol "Proses & Terapkan Data".`,
          type: "info",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = () => {
    try {
      const trimmed = importJson.trim();
      if (!trimmed) return;

      if (importType === "lookbook") {
        let looks: TrendingLook[] = [];
        if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
          const parsed = JSON.parse(trimmed);
          looks = Array.isArray(parsed) ? parsed : [parsed];
        } else {
          looks = parseCsvToTrendingLooks(trimmed);
        }

        if (looks.length > 0) {
          saveBulkAdminLookbook(looks);
          setImportJson("");
          refreshAllData();
          addToast({
            title: "Lookbook Berhasil Diimpor!",
            description: `${looks.length} outfit berhasil diterapkan ke Lookbook & Studio.`,
            type: "success",
          });
        } else {
          addToast({
            title: "Gagal Mengurai Data",
            description: "Format CSV atau JSON tidak valid. Pastikan header kolom sesuai template.",
            type: "error",
          });
        }
        return;
      }

      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        if (importType === "presets") {
          const dict: Record<string, OOTDRecommendation> = {};
          parsed.forEach((p: OOTDRecommendation) => {
            if (p.id) dict[p.id] = p;
          });
          localStorage.setItem("looku_custom_presets", JSON.stringify(dict));
          window.dispatchEvent(new Event("looku_presets_updated"));
          addToast({ title: "Presets Berhasil Diimpor!", description: `${parsed.length} formula dimuat.`, type: "success" });
        } else if (importType === "catalog") {
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
      addToast({ title: "Gagal Parsing Data", description: "Pastikan format JSON atau CSV sesuai template.", type: "error" });
    }
  };

  // Filtered Lookbook
  const filteredLookbook = lookbookItems.filter((look) => {
    const q = lookbookSearch.toLowerCase();
    const matchesSearch =
      (look.title || "").toLowerCase().includes(q) ||
      (look.vibe || "").toLowerCase().includes(q) ||
      (look.category || "").toLowerCase().includes(q) ||
      (look.tag || "").toLowerCase().includes(q) ||
      (look.skinToneRecommendation || "").toLowerCase().includes(q);

    if (!matchesSearch) return false;

    const isVerifiedAndPublished = look.is_verified !== false && look.is_published !== false;
    if (lookbookCategoryFilter === "verified") return isVerifiedAndPublished;
    if (lookbookCategoryFilter === "draft") return !isVerifiedAndPublished;
    if (lookbookCategoryFilter === "Semua") return true;
    if (lookbookCategoryFilter === "golden") return look.isGoldenSignature || look.outfit?.isGoldenSignature;
    if (lookbookCategoryFilter === "shopee") {
      return Boolean(look.shopeeUrl || look.outfit?.items?.some((it) => it.shopeeUrl));
    }
    if (lookbookCategoryFilter === "hijab") {
      return (
        look.tag?.toUpperCase().includes("HIJAB") ||
        look.category?.toLowerCase().includes("hijab") ||
        look.outfit?.modestFriendly
      );
    }
    if (lookbookCategoryFilter === "pria") {
      return look.tag?.toUpperCase() === "MENSWEAR" || look.category?.toLowerCase().includes("pria");
    }
    if (lookbookCategoryFilter === "wanita") {
      const isPria = look.tag?.toUpperCase() === "MENSWEAR" || look.category?.toLowerCase().includes("pria");
      const isHijab =
        look.tag?.toUpperCase().includes("HIJAB") ||
        look.category?.toLowerCase().includes("hijab") ||
        look.outfit?.modestFriendly;
      return !isPria && !isHijab;
    }
    return true;
  });

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
                  placeholder="Masukkan PIN Akses Admin"
                  className="w-full px-4 py-3 rounded-xl bg-sand-50 border border-sand-300 text-sm text-charcoal-900 font-mono focus:outline-none focus:border-terracotta-500 transition-colors"
                />
                {pinError && (
                  <p className="text-[11px] text-rose-500 font-mono">
                    PIN akses salah. Hubungi administrator internal.
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

            <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-left text-xs text-[#5C554E] leading-relaxed">
              🔒 <b>Akses Penguji &amp; Kurator:</b> Masukkan PIN <code className="bg-sand-200 text-charcoal-900 font-bold px-1.5 py-0.5 rounded font-mono">admin</code> atau <code className="bg-sand-200 text-charcoal-900 font-bold px-1.5 py-0.5 rounded font-mono">looku2026</code>.
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
              rel="noopener noreferrer"
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
        {/* ============================================================ */}
        {/* TOP VISUAL KPI DASHBOARD & CONVERSION ANALYTICS               */}
        {/* ============================================================ */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-sand-300 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-terracotta-600">
                  LIVE ATELIER ANALYTICS & AFFILIATE CONVERSION
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-charcoal-900">
                Dashboard Manajemen Kurasi & Afiliasi Look.u
              </h1>
              <p className="text-xs text-sand-500">
                Data tersinkronisasi 2 arah secara instan antara CMS Admin, Lookbook publik, dan AI Styling Studio.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl text-emerald-800 text-xs font-mono shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold">Real-time Two-Way Sync Active</span>
            </div>
          </div>

          {/* 4 Analytics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Curated Looks */}
            <div className="p-5 rounded-2xl bg-white border border-sand-300 shadow-tactile space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-sand-500">Total Lookbook</span>
                <div className="w-8 h-8 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-serif font-bold text-charcoal-900">
                {metrics?.totalLookbook ?? lookbookItems.length}
                <span className="text-xs font-sans font-normal text-sand-400 ml-1.5">Outfit</span>
              </div>
              <div className="text-[11px] text-amber-600 font-mono font-bold flex items-center gap-1 pt-1 border-t border-sand-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{metrics?.totalGoldenLooks ?? 0} Golden Signature Looks</span>
              </div>
            </div>

            {/* Card 2: Active Shopee Links */}
            <div className="p-5 rounded-2xl bg-white border border-sand-300 shadow-tactile space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-sand-500">Shopee Affiliate Aktif</span>
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#EE4D2D] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-serif font-bold text-[#EE4D2D]">
                {metrics?.totalActiveShopeeLinks ?? 0}
                <span className="text-xs font-sans font-normal text-sand-400 ml-1.5">Tautan</span>
              </div>
              <div className="text-[11px] text-orange-600 font-mono font-semibold pt-1 border-t border-sand-200">
                Direct Setelan & Produk Satuan
              </div>
            </div>

            {/* Card 3: Live Affiliate Clicks */}
            <div className="p-5 rounded-2xl bg-white border border-sand-300 shadow-tactile space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-sand-500">Trafik Afiliasi (Live)</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MousePointerClick className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-serif font-bold text-emerald-700">
                {metrics?.affiliateStats.totalClicks ?? 0}
                <span className="text-xs font-sans font-normal text-sand-400 ml-1.5">Klik</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-mono font-bold pt-1 border-t border-sand-200">
                Est. Komisi: Rp {(metrics?.affiliateStats.estimatedCommissionRp ?? 0).toLocaleString("id-ID")}
              </div>
            </div>

            {/* Card 4: Catalog & Presets */}
            <div className="p-5 rounded-2xl bg-white border border-sand-300 shadow-tactile space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-sand-500">Gudang Katalog Busana</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-serif font-bold text-charcoal-900">
                {metrics?.totalCatalogItems ?? catalog.length}
                <span className="text-xs font-sans font-normal text-sand-400 ml-1.5">Item</span>
              </div>
              <div className="text-[11px] text-blue-600 font-mono font-semibold pt-1 border-t border-sand-200">
                {metrics?.totalPresets ?? presets.length} Preset Engine Heuristik
              </div>
            </div>
          </div>

          {/* Category Distribution Pills Strip */}
          <div className="flex flex-wrap items-center gap-2.5 p-3.5 bg-sand-100/70 border border-sand-300 rounded-2xl text-xs">
            <span className="font-mono font-bold uppercase text-[10px] text-sand-600 tracking-wider mr-1">
              Distribusi Kategori:
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
              🧕 <b>Hijab & Modest:</b> {metrics?.categories.hijab ?? 0} Look
            </span>
            <span className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-medium">
              👗 <b>Wanita Modern:</b> {metrics?.categories.wanita ?? 0} Look
            </span>
            <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-medium">
              👔 <b>Pria & Menswear:</b> {metrics?.categories.pria ?? 0} Look
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
              ⭐ <b>Golden Signature:</b> {metrics?.totalGoldenLooks ?? 0} Look
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-300 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "lookbook", label: `Kurasi Lookbook (${lookbookItems.length})`, icon: Sparkles },
              { id: "presets", label: `Formula OOTD (${presets.length})`, icon: Tag },
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
            {activeTab === "lookbook" && (
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="/audit-katalog-looku.csv"
                  download="AUDIT_KATALOG_322_LOOKU.csv"
                  className="py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Unduh Spreadsheet Hasil Audit 322 Item Katalog Look.u"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Audit 322 Item (.CSV)</span>
                </a>
                <a
                  href="/templates/TEMPLATE_LOOKBOOK_LOOKU.csv"
                  download="TEMPLATE_LOOKBOOK_LOOKU.csv"
                  className="py-2.5 px-3.5 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  title="Unduh format template Excel untuk pengisian data massal"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Template Excel</span>
                </a>
                <button
                  onClick={handleExportLookbookCsv}
                  className="py-2.5 px-3.5 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  title="Ekspor seluruh outfit lookbook yang sedang aktif ke file CSV/Excel"
                >
                  <Download className="w-4 h-4 text-charcoal-900" />
                  <span>Ekspor CSV</span>
                </button>
                <button
                  onClick={handleOpenNewLook}
                  className="py-2.5 px-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Lookbook Baru</span>
                </button>
              </div>
            )}

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
        {/* TAB 0: LOOKBOOK OOTD FEED CURATION & DIRECT SHOPEE CMS       */}
        {/* ============================================================ */}
        {activeTab === "lookbook" && (
          <div className="space-y-4">
            {/* Google Sheets Live Sync Card */}
            <div className="p-4 bg-white rounded-2xl border border-emerald-300 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    📊
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal-900">
                      Google Sheets Live Kurasi Sync
                    </h4>
                    <p className="text-[11px] text-sand-600">
                      Kurasi outfit Anda sendiri di Google Sheets lalu sinkronkan langsung ke katalog Look.u secara real-time.
                    </p>
                  </div>
                </div>
                <a
                  href="/TEMPLATE_LOOKBOOK_LOOKU_FASHION.csv"
                  download="TEMPLATE_LOOKBOOK_LOOKU_FASHION.csv"
                  className="text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Template Google Sheet (.csv)</span>
                </a>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={googleSheetUrl}
                  onChange={(e) => setGoogleSheetUrl(e.target.value)}
                  placeholder="Tempel link Google Sheet Anda di sini (contoh: https://docs.google.com/spreadsheets/d/...)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 text-xs font-mono text-charcoal-900 focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={handleSyncGoogleSheets}
                  disabled={isSyncingSheets || !googleSheetUrl.trim()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheets ? "animate-spin" : ""}`} />
                  <span>{isSyncingSheets ? "Menyinkronkan..." : "Tarik & Sinkronkan ➔"}</span>
                </button>
              </div>
            </div>
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" />
                <input
                  type="text"
                  value={lookbookSearch}
                  onChange={(e) => setLookbookSearch(e.target.value)}
                  placeholder="Cari outfit berdasarkan judul, vibe, kategori, atau tag..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-sand-300 text-xs text-charcoal-900 focus:outline-none focus:border-terracotta-500 shadow-2xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "verified", label: `✅ Verified & Tayang (${lookbookItems.filter((l) => l.is_verified !== false && l.is_published !== false).length})` },
                  { id: "draft", label: `⏸️ Draft Disembunyikan (${lookbookItems.filter((l) => l.is_verified === false || l.is_published === false).length})` },
                  { id: "Semua", label: `Semua (${lookbookItems.length})` },
                  { id: "hijab", label: "🧕 Hijab & Modest" },
                  { id: "wanita", label: "👗 Wanita" },
                  { id: "pria", label: "👔 Pria" },
                  { id: "golden", label: "⭐ Golden Looks" },
                  { id: "shopee", label: "🛍️ Shopee Aktif" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setLookbookCategoryFilter(f.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      lookbookCategoryFilter === f.id
                        ? "bg-charcoal-900 text-white font-bold"
                        : "bg-white text-sand-600 hover:bg-sand-100 border border-sand-300"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lookbook Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredLookbook.map((look) => {
                const shopeeItemsCount = (look.outfit?.items || []).filter((it) => Boolean(it.shopeeUrl)).length;
                const hasShopee = Boolean(look.shopeeUrl || shopeeItemsCount > 0);
                const isGolden = Boolean(look.isGoldenSignature || look.outfit?.isGoldenSignature);

                return (
                  <div
                    key={look.id}
                    className="group bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-tactile flex flex-col justify-between hover:border-charcoal-900 transition-all"
                  >
                    <div>
                      {/* Image Preview with Badges */}
                      <div className="relative aspect-[3/4] w-full bg-sand-100 overflow-hidden">
                        <img
                          src={look.image}
                          alt={look.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                            {look.tag || "LOOK"}
                          </span>
                          {isGolden && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                              ⭐ GOLDEN
                            </span>
                          )}
                        </div>

                        {/* Price Overlay */}
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-charcoal-900 font-mono text-[10px] font-bold shadow-xs">
                            {look.priceRange || "Rp 150rb - 250rb"}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-sand-500">
                          <span>{look.category}</span>
                          <span className="text-terracotta-600 font-semibold">{look.vibe}</span>
                        </div>

                        <h3 className="font-serif font-bold text-sm text-charcoal-900 leading-snug line-clamp-1">
                          {look.title}
                        </h3>

                        {/* Shopee Affiliate Status Pill */}
                        <div className="pt-1">
                          {look.shopeeUrl ? (
                            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#EE4D2D] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                              <span>🛍️ Shopee Setelan: Aktif</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-auto" />
                            </div>
                          ) : shopeeItemsCount > 0 ? (
                            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <span>🎯 {shopeeItemsCount}/4 Item Shopee Terhubung</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] font-mono text-sand-400 bg-sand-50 border border-sand-200 px-2 py-0.5 rounded-md">
                              <span>⚠️ Belum ada Shopee URL (pakai query)</span>
                            </div>
                          )}
                        </div>

                        {/* Skin Tone & Items Preview */}
                        <p className="text-[11px] text-sand-500 line-clamp-1 font-sans">
                          Skin: {look.skinToneRecommendation || "Semua Skin Tone"}
                        </p>

                        <div className="pt-1 flex flex-wrap gap-1">
                          {(look.outfit?.items || []).slice(0, 4).map((it, idx) => (
                            <span
                              key={idx}
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                                it.shopeeUrl
                                  ? "bg-orange-50 border-orange-200 text-[#EE4D2D] font-bold"
                                  : "bg-sand-50 border-sand-200 text-sand-600"
                              }`}
                              title={it.shopeeUrl ? `Shopee: ${it.shopeeUrl}` : it.name}
                            >
                              {it.category}: {it.name.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-3 pt-2.5 pb-1 bg-sand-50/80 border-t border-sand-200 flex items-center justify-between gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                        look.is_verified !== false && look.is_published !== false
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}>
                        {look.is_verified !== false && look.is_published !== false ? "✓ VERIFIED (TAYANG)" : "⏸ DRAFT (HIDDEN)"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleVerifyLook(look)}
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md transition-colors ${
                          look.is_verified !== false && look.is_published !== false
                            ? "bg-white hover:bg-rose-50 text-sand-600 hover:text-rose-700 border border-sand-300"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {look.is_verified !== false && look.is_published !== false ? "Sembunyikan" : "Verifikasi & Tayangkan"}
                      </button>
                    </div>
                    <div className="p-3 pt-1.5 bg-sand-50/80 flex items-center justify-between gap-1.5">
                      <Link
                        href={`/studio?look=${look.id}`}
                        target="_blank"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-sand-100 text-charcoal-900 text-[11px] font-mono font-bold border border-sand-300 text-center transition-colors flex items-center justify-center gap-1"
                        title="Buka dan racik formula ini di AI Studio"
                      >
                        <span>Studio</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>

                      <button
                        onClick={() => handleEditLook(look)}
                        className="py-1.5 px-3 rounded-lg bg-charcoal-900 hover:bg-terracotta-500 text-white text-[11px] font-mono font-bold transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteLook(look.id, look.title)}
                        className="p-1.5 rounded-lg text-sand-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Outfit dari Lookbook"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredLookbook.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-sand-300 space-y-3">
                <Sparkles className="w-8 h-8 text-sand-400 mx-auto" />
                <h3 className="font-serif font-bold text-base text-charcoal-900">
                  Tidak ada outfit yang cocok dengan filter
                </h3>
                <p className="text-xs text-sand-500">
                  Coba ubah kata kunci pencarian atau kategori filter di atas.
                </p>
              </div>
            )}
          </div>
        )}

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

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importType"
                    checked={importType === "lookbook"}
                    onChange={() => setImportType("lookbook")}
                    className="accent-terracotta-500"
                  />
                  <span className="text-terracotta-700">⭐ Impor Lookbook OOTD (CSV / Excel / JSON)</span>
                </label>
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

              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-sand-50 rounded-2xl border border-sand-300">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer py-2 px-3.5 rounded-xl bg-white border border-sand-300 hover:bg-sand-100 text-xs font-bold text-charcoal-900 flex items-center gap-1.5 shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>📁 Unggah File CSV / Excel (.csv)</span>
                    <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <span className="text-[11px] text-sand-500">atau tempel teks CSV/JSON langsung pada kolom di bawah:</span>
                </div>
                <a
                  href="/audit-katalog-looku.csv"
                  download="AUDIT_KATALOG_322_LOOKU.csv"
                  className="py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Unduh Spreadsheet Hasil Audit 322 Item Katalog Look.u"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Audit 322 Item (.CSV)</span>
                </a>
                <a
                  href="/templates/TEMPLATE_LOOKBOOK_LOOKU.csv"
                  download="TEMPLATE_LOOKBOOK_LOOKU.csv"
                  className="text-xs font-bold text-terracotta-600 hover:underline flex items-center gap-1 py-1 px-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Template Excel (.csv)</span>
                </a>
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
      {/* LOOKBOOK EDIT / CREATE MODAL WITH DIRECT SHOPEE URLS         */}
      {/* ============================================================ */}
      {isLookModalOpen && editingLook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sand-300 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-terracotta-600">
                  LOOKBOOK CURATION & SHOPEE AFFILIATE ENGINE
                </span>
                <h3 className="font-serif font-bold text-xl text-charcoal-900">
                  {editingLook.id.startsWith("custom_look_") ? "Tambah Outfit Lookbook Baru" : "Edit Outfit Lookbook"}
                </h3>
              </div>
              <button
                onClick={() => setIsLookModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-sand-100 transition-colors"
              >
                <X className="w-5 h-5 text-charcoal-900" />
              </button>
            </div>

            <form onSubmit={handleSaveLookForm} className="space-y-6 text-xs">
              {/* Section 1: Overview */}
              <div className="space-y-3">
                <h4 className="font-mono font-bold text-[11px] uppercase tracking-wider text-charcoal-900 border-b border-sand-200 pb-1">
                  1. Identitas & Tampilan Lookbook
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold font-mono">Judul Setelan OOTD:</label>
                    <input
                      type="text"
                      required
                      value={editingLook.title}
                      onChange={(e) => setEditingLook({ ...editingLook, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-bold text-charcoal-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold font-mono">Tag Badge (e.g. SIGNATURE LOOK, HIJAB CASUAL):</label>
                    <input
                      type="text"
                      required
                      value={editingLook.tag}
                      onChange={(e) => setEditingLook({ ...editingLook, tag: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-mono font-bold uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold font-mono">Kategori Acara:</label>
                    <input
                      type="text"
                      required
                      value={editingLook.category}
                      onChange={(e) => setEditingLook({ ...editingLook, category: e.target.value })}
                      placeholder="Campus Hijab, Work, Weekend..."
                      className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold font-mono">Overall Vibe:</label>
                    <input
                      type="text"
                      required
                      value={editingLook.vibe}
                      onChange={(e) => setEditingLook({ ...editingLook, vibe: e.target.value })}
                      placeholder="Earthy Minimalist, Quiet Luxury..."
                      className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold font-mono">Rentang Harga:</label>
                    <input
                      type="text"
                      required
                      value={editingLook.priceRange}
                      onChange={(e) => setEditingLook({ ...editingLook, priceRange: e.target.value })}
                      placeholder="Rp 210.000 - Rp 295.000"
                      className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold font-mono">Rekomendasi Skin Tone:</label>
                    <input
                      type="text"
                      required
                      value={editingLook.skinToneRecommendation}
                      onChange={(e) => setEditingLook({ ...editingLook, skinToneRecommendation: e.target.value })}
                      placeholder="Sawo Matang & Kuning Langsat"
                      className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(editingLook.isGoldenSignature)}
                        onChange={(e) => setEditingLook({ ...editingLook, isGoldenSignature: e.target.checked })}
                        className="w-4 h-4 rounded text-terracotta-500 focus:ring-terracotta-400"
                      />
                      <span className="font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                        ⭐ Jadikan Golden Signature Look (Prioritas Teratas)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 2: Photo & Full Set Shopee URL */}
              <div className="space-y-3">
                <h4 className="font-mono font-bold text-[11px] uppercase tracking-wider text-charcoal-900 border-b border-sand-200 pb-1">
                  2. Foto Model & Link Afiliasi Full-Set
                </h4>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Photo Preview Thumbnail */}
                  <div className="w-24 h-32 rounded-xl bg-sand-100 border border-sand-300 overflow-hidden shrink-0">
                    <img
                      src={editingLook.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-bold font-mono">
                          URL Foto Model (Pinterest / Uniqlo / Google / Unsplash):
                        </label>
                        <button
                          type="button"
                          onClick={handleAutoExtractImage}
                          disabled={isExtractingImage || !editingLook.image.trim()}
                          className="px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 border border-sand-300 text-[10px] font-mono font-bold text-charcoal-900 flex items-center gap-1 transition-colors disabled:opacity-40"
                          title="Ekstrak gambar otomatis jika menempelkan link produk Uniqlo, Zalora, atau link Google"
                        >
                          <Search className="w-3 h-3" />
                          <span>{isExtractingImage ? "Mengekstrak..." : "🔍 Ekstrak dari Link Web"}</span>
                        </button>
                      </div>
                      <input
                        type="url"
                        required
                        value={editingLook.image}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder="https://i.pinimg.com/... atau https://image.uniqlo.com/... atau link halaman produk Uniqlo"
                        className="w-full p-2.5 rounded-xl bg-sand-50 border border-sand-300 font-mono text-[11px]"
                      />
                      <p className="text-[10px] text-sand-500 font-sans leading-tight">
                        💡 <b>Tips Cepat:</b> Di Pinterest, Google, atau Uniqlo, cukup <b>Klik Kanan pada Foto ➔ Pilih &quot;Copy Image Address&quot; (Salin Alamat Gambar)</b> lalu tempel di sini. Atau tempel link produk Uniqlo lalu klik tombol <b>Ekstrak</b> di atas.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold font-mono text-[#EE4D2D] flex items-center gap-1.5">
                        <span>🛍️ Tautan Afiliasi Shopee Full-Set (Opsional):</span>
                        <span className="text-[10px] text-sand-500 font-normal">
                          (Tombol "Beli Setelan Ini di Shopee" di Lookbook)
                        </span>
                      </label>
                      <input
                        type="url"
                        value={editingLook.shopeeUrl || ""}
                        onChange={(e) => setEditingLook({ ...editingLook, shopeeUrl: e.target.value })}
                        placeholder="https://shopee.co.id/product/..."
                        className="w-full p-2.5 rounded-xl bg-orange-50/50 border border-orange-200 font-mono text-[11px] text-[#EE4D2D] focus:border-[#EE4D2D]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: 4 Items Breakdown with Individual Shopee Links */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-sand-200 pb-1">
                  <h4 className="font-mono font-bold text-[11px] uppercase tracking-wider text-charcoal-900">
                    3. Rincian 4 Komponen Busana & Direct Shopee URL
                  </h4>
                  <span className="text-[10px] font-mono text-sand-500">
                    Atasan • Bawahan • Outer/Hijab • Sepatu
                  </span>
                </div>

                <div className="space-y-3">
                  {(editingLook.outfit?.items || []).map((it, idx) => {
                    const slotLabels = ["1. Atasan (Top)", "2. Bawahan (Bottom)", "3. Outer / Hijab", "4. Sepatu (Footwear)"];
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-sand-50/70 border border-sand-300 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[11px] uppercase text-charcoal-900">
                            {slotLabels[idx] || `Item #${idx + 1} (${it.category})`}
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-white px-2 py-0.5 rounded border border-sand-200">
                            Slot {it.category}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-sand-600">Nama Item:</label>
                            <input
                              type="text"
                              required
                              value={it.name}
                              onChange={(e) => {
                                const updated = [...(editingLook.outfit?.items || [])];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setEditingLook({
                                  ...editingLook,
                                  outfit: { ...(editingLook.outfit as any), items: updated },
                                });
                              }}
                              className="w-full p-2 rounded-lg bg-white border border-sand-300 text-xs font-semibold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-sand-600">Bahan Kain:</label>
                            <input
                              type="text"
                              required
                              value={it.material}
                              onChange={(e) => {
                                const updated = [...(editingLook.outfit?.items || [])];
                                updated[idx] = { ...updated[idx], material: e.target.value };
                                setEditingLook({
                                  ...editingLook,
                                  outfit: { ...(editingLook.outfit as any), items: updated },
                                });
                              }}
                              className="w-full p-2 rounded-lg bg-white border border-sand-300 text-xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-sand-600">Estimasi Harga:</label>
                            <input
                              type="text"
                              required
                              value={it.estimatedPrice}
                              onChange={(e) => {
                                const updated = [...(editingLook.outfit?.items || [])];
                                updated[idx] = { ...updated[idx], estimatedPrice: e.target.value };
                                setEditingLook({
                                  ...editingLook,
                                  outfit: { ...(editingLook.outfit as any), items: updated },
                                });
                              }}
                              className="w-full p-2 rounded-lg bg-white border border-sand-300 font-mono text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-[#EE4D2D] flex items-center gap-1">
                              <span>🛍️ Tautan Langsung Shopee Produk Ini (Affiliate):</span>
                            </label>
                            <input
                              type="url"
                              value={it.shopeeUrl || ""}
                              onChange={(e) => {
                                const updated = [...(editingLook.outfit?.items || [])];
                                updated[idx] = { ...updated[idx], shopeeUrl: e.target.value };
                                setEditingLook({
                                  ...editingLook,
                                  outfit: { ...(editingLook.outfit as any), items: updated },
                                });
                              }}
                              placeholder="https://shopee.co.id/product/..."
                              className="w-full p-2 rounded-lg bg-white border border-orange-200 text-[#EE4D2D] font-mono text-[10px] focus:border-[#EE4D2D]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-sand-600">
                              Fallback Kata Kunci Shopee:
                            </label>
                            <input
                              type="text"
                              value={it.shopeeQuery || ""}
                              onChange={(e) => {
                                const updated = [...(editingLook.outfit?.items || [])];
                                updated[idx] = { ...updated[idx], shopeeQuery: e.target.value };
                                setEditingLook({
                                  ...editingLook,
                                  outfit: { ...(editingLook.outfit as any), items: updated },
                                });
                              }}
                              className="w-full p-2 rounded-lg bg-white border border-sand-300 font-mono text-[10px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 pt-1">
                          <label className="text-[10px] font-mono font-bold text-charcoal-900 flex items-center justify-between">
                            <span>📸 URL Gambar CDN Item Satuan (Opsional - Uniqlo/Pinterest/Unsplash):</span>
                            <span className="text-[9px] text-emerald-700 font-normal">Kosongkan = Pakai Auto Packshot Studio Bersih</span>
                          </label>
                          <input
                            type="url"
                            value={it.imageUrl || ""}
                            onChange={(e) => {
                              const updated = [...(editingLook.outfit?.items || [])];
                              updated[idx] = { ...updated[idx], imageUrl: e.target.value.trim() || undefined };
                              setEditingLook({
                                ...editingLook,
                                outfit: { ...(editingLook.outfit as any), items: updated },
                              });
                            }}
                            placeholder="https://image.uniqlo.com/... (Kosongkan jika ingin otomatis dari kamus packshot)"
                            className="w-full p-2 rounded-lg bg-white border border-sand-300 font-mono text-[10px]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Automated Verification Pipeline */}
              {(() => {
                const vRes = validateLookbookItem(editingLook);
                return (
                  <div className={`p-4 rounded-2xl border space-y-2.5 ${
                    vRes.isValid ? "bg-emerald-50/60 border-emerald-200" : "bg-amber-50/70 border-amber-200"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[11px] uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>4. Pipeline Validasi Otomatis Sebelum Publish</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        vRes.isValid ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
                      }`}>
                        {vRes.isValid ? "LOLOS VALIDASI" : "PERLU DICEK"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
                      <div className={vRes.checks.cleanTitle ? "text-emerald-800 font-semibold" : "text-rose-600 font-bold"}>
                        {vRes.checks.cleanTitle ? "✓ Nama Bebas #Angka" : "✕ Nama Masih Mentah"}
                      </div>
                      <div className={vRes.checks.validHeroImage ? "text-emerald-800 font-semibold" : "text-rose-600 font-bold"}>
                        {vRes.checks.validHeroImage ? "✓ Foto Utama Hidup" : "✕ Foto Utama Invalid"}
                      </div>
                      <div className={vRes.checks.validItemsAndBrands ? "text-emerald-800 font-semibold" : "text-rose-600 font-bold"}>
                        {vRes.checks.validItemsAndBrands ? "✓ 4 Item & Link Valid" : "✕ Cek 4 Item Produk"}
                      </div>
                      <div className={vRes.checks.validPricing ? "text-emerald-800 font-semibold" : "text-rose-600 font-bold"}>
                        {vRes.checks.validPricing ? "✓ Harga Perkiraan Valid" : "✕ Format Harga Rp"}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-black/10 flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer select-none font-mono font-bold text-charcoal-900">
                        <input
                          type="checkbox"
                          checked={editingLook.is_verified !== false && editingLook.is_published !== false}
                          onChange={(e) =>
                            setEditingLook({
                              ...editingLook,
                              is_verified: e.target.checked,
                              is_published: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded text-emerald-600"
                        />
                        <span>✓ Tandai Verified &amp; Tayangkan di Lookbook Publik (is_verified = true)</span>
                      </label>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setIsLookModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-900 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan & Sinkronkan ke Publik ➔</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
