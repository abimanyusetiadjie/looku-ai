"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  User, 
  Sparkles, 
  Bookmark, 
  Trophy, 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  Edit3, 
  Check, 
  Share2, 
  Download, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Tag,
  Copy,
  Crown,
  Settings,
  Flame
} from "lucide-react";
import { 
  calculateProfileSummary, 
  saveStoredUserProfile, 
  ProfileSummary, 
  DEFAULT_USER_PROFILE,
  UserRole,
  ROLE_PRIVILEGES
} from "@/lib/profile-stats";
import Toast, { ToastMessage } from "@/components/Toast";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const [summary, setSummary] = useState<ProfileSummary>(() => {
    if (typeof window !== "undefined") {
      try {
        return calculateProfileSummary();
      } catch (e) {
        console.error(e);
      }
    }
    return {
      profile: DEFAULT_USER_PROFILE,
      privilege: ROLE_PRIVILEGES.vip,
      totalSaved: 0,
      totalGenerated: 1,
      totalVotesGiven: 0,
      totalChallengeSubmissions: 0,
      totalLikedLooks: 0,
      dominantColors: [
        { hex: "#BA5D38", name: "Terracotta Earth", count: 1, percentage: 35 },
        { hex: "#8A9A86", name: "Sage Green", count: 1, percentage: 25 },
        { hex: "#E8DFD1", name: "Warm Sand", count: 1, percentage: 20 },
        { hex: "#2B2620", name: "Charcoal Deep", count: 1, percentage: 20 },
      ],
      vibeBreakdown: [
        { vibe: "Earthy Minimalist", count: 1, percentage: 50 },
        { vibe: "Casual Clean", count: 1, percentage: 30 },
        { vibe: "Smart Formal", count: 1, percentage: 20 },
      ],
      activityHeatmap: [],
      affiliateStats: {
        totalClicks: 0,
        shopeeClicks: 0,
        tokopediaClicks: 0,
        topQueries: [],
        clicksBySource: { catalog: 0, outfit_card: 0, chatbot: 0, influencer_dupe: 0, story: 0, couple_card: 0 },
        estimatedCommissionRp: 0,
      },
      styleConsistencyScore: 82,
      dominantTone: "Sawo Matang (Warm Autumn)",
      xp: 380,
      nextLevelXp: 450,
      levelTitle: "Style Explorer (Level 2)",
    };
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editCustomAffiliateId, setEditCustomAffiliateId] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedMemberId, setCopiedMemberId] = useState(false);
  const [copiedCreatorLink, setCopiedCreatorLink] = useState(false);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = () => {
    try {
      const data = calculateProfileSummary();
      setSummary(data);
      setEditName(data.profile.name);
      setEditBio(data.profile.bio);
      setEditInstagram(data.profile.instagram);
      setEditCustomAffiliateId(data.profile.customAffiliateId || "looku_ootd");
    } catch (e) {
      console.error("Error refreshing profile:", e);
    }
  };

  useEffect(() => {
    refreshData();

    const handleUpdate = () => refreshData();
    window.addEventListener("looku_profile_updated", handleUpdate);
    window.addEventListener("looku_saved_updated", handleUpdate);
    window.addEventListener("looku_affiliate_click_recorded", handleUpdate);

    return () => {
      window.removeEventListener("looku_profile_updated", handleUpdate);
      window.removeEventListener("looku_saved_updated", handleUpdate);
      window.removeEventListener("looku_affiliate_click_recorded", handleUpdate);
    };
  }, []);

  const handleSaveProfile = () => {
    saveStoredUserProfile({
      name: editName.trim() || DEFAULT_USER_PROFILE.name,
      bio: editBio.trim() || DEFAULT_USER_PROFILE.bio,
      instagram: editInstagram.trim() || DEFAULT_USER_PROFILE.instagram,
      customAffiliateId: editCustomAffiliateId.trim() || "looku_ootd",
    });
    setIsEditing(false);
    addToast({
      title: "Profil Diperbarui!",
      description: "Data identitas & preferensi role telah disimpan.",
      type: "success",
    });
  };

  const handleSwitchRole = (newRole: UserRole) => {
    saveStoredUserProfile({ role: newRole });
    refreshData();
    addToast({
      title: `Role Dialihkan: ${ROLE_PRIVILEGES[newRole].title}`,
      description: `Hak akses & fitur tampilan profil telah disesuaikan.`,
      type: "curate",
    });
  };

  const handleCopyMemberId = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary.profile.memberId);
    setCopiedMemberId(true);
    setTimeout(() => setCopiedMemberId(false), 2000);
    addToast({
      title: "ID Member Disalin!",
      description: `#${summary.profile.memberId} tersalin ke clipboard`,
      type: "info",
    });
  };

  const handleCopyCreatorLink = () => {
    if (!summary) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : "https://looku.ai"}?creator=${summary.profile.instagram.replace("@", "")}`;
    navigator.clipboard.writeText(url);
    setCopiedCreatorLink(true);
    setTimeout(() => setCopiedCreatorLink(false), 2000);
    addToast({
      title: "Link Portofolio Kreator Disalin!",
      description: "Siap dibagikan ke bio Instagram / TikTok kamu ✨",
      type: "curate",
    });
  };

  const handleExportData = () => {
    if (typeof window === "undefined") return;
    const backup = {
      profile: localStorage.getItem("looku_user_profile"),
      savedOutfits: localStorage.getItem("looku_saved_outfits"),
      history: localStorage.getItem("looku_generation_history"),
      affiliateClicks: localStorage.getItem("looku_affiliate_clicks"),
      votedChallenges: localStorage.getItem("looku_voted_challenges"),
      myChallenges: localStorage.getItem("looku_my_challenge_ids"),
      likedLooks: localStorage.getItem("looku_liked_looks"),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `looku-profile-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      title: "Data Diekspor!",
      description: "Backup seluruh koleksi & preferensi berhasil diunduh.",
      type: "info",
    });
  };

  const handleResetData = () => {
    if (confirm("Apakah kamu yakin ingin mengosongkan seluruh riwayat dan lemari pakaian di perangkat ini?")) {
      localStorage.removeItem("looku_saved_outfits");
      localStorage.removeItem("looku_generation_history");
      localStorage.removeItem("looku_affiliate_clicks");
      localStorage.removeItem("looku_chat_messages");
      localStorage.removeItem("looku_liked_looks");
      localStorage.removeItem("looku_voted_challenges");
      localStorage.removeItem("looku_my_challenge_ids");
      refreshData();
      addToast({
        title: "Data Direset",
        description: "Penyimpanan lokal telah dibersihkan.",
        type: "error",
      });
    }
  };

  const { 
    profile, 
    privilege, 
    dominantColors, 
    vibeBreakdown, 
    activityHeatmap, 
    affiliateStats, 
    xp, 
    nextLevelXp, 
    levelTitle 
  } = summary;

  const xpPercent = Math.min(Math.round((xp / nextLevelXp) * 100), 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] pb-28 md:pb-16 text-charcoal-900">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFD1] pt-[max(0px,env(safe-area-inset-top))]">
        <div className="max-w-md md:max-w-5xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 p-2 md:p-0 rounded-xl bg-white md:bg-transparent border md:border-0 border-sand-300 text-xs font-bold uppercase tracking-wider text-charcoal-900/70 hover:text-charcoal-900 transition-colors shadow-2xs md:shadow-none"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Kembali ke Beranda</span>
          </Link>

          <div className="font-serif italic font-bold text-xl text-[#181A18] flex items-baseline">
            look<span className="text-terracotta-500 not-italic">.</span>u
            <span className="font-mono text-[9px] not-italic ml-1.5 uppercase font-bold text-sand-500 tracking-wider">
              Profile
            </span>
          </div>

          <Link
            href="/studio"
            className="py-1.5 px-3 md:py-2 md:px-3.5 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-terracotta-400" />
            <span className="hidden sm:inline">Buka Studio</span>
            <span className="inline sm:hidden">Studio</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-md md:max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-10 w-full space-y-6 sm:space-y-8">
        {/* 0. Quick Role Switcher Simulator (Demo & Mode Penyesuaian) */}
        <div className="p-3 rounded-2xl bg-sand-100 border border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal-900">
            <Settings className="w-4 h-4 text-terracotta-600" />
            <span>Role Simulator & Pengaturan Hak Akses:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-sand-300">
            {(["free", "vip", "creator", "admin"] as UserRole[]).map((r) => {
              const isCurrent = profile.role === r;
              const meta = ROLE_PRIVILEGES[r];
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSwitchRole(r)}
                  className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    isCurrent
                      ? "bg-charcoal-900 text-white shadow-xs"
                      : "text-charcoal-900/60 hover:text-charcoal-900 hover:bg-sand-50"
                  }`}
                >
                  {meta.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. Header Profile Card with Role & XP Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile relative overflow-hidden space-y-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Avatar Circle with Role Ring */}
              <div className="relative shrink-0">
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-[#181A18] to-terracotta-600 text-white font-serif font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-4 border-white">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-charcoal-900 text-white border-2 border-white flex items-center justify-center text-[9px] font-mono font-bold shadow-md">
                  {profile.role === "vip" ? "VIP" : profile.role === "creator" ? "CR" : profile.role === "admin" ? "ADM" : "MBR"}
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                {isEditing ? (
                  <div className="space-y-2 max-w-md">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nama kamu..."
                      className="w-full px-3 py-1.5 rounded-xl bg-sand-50 border border-sand-300 text-sm font-bold text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                    />
                    <input
                      type="text"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Bio singkat..."
                      className="w-full px-3 py-1.5 rounded-xl bg-sand-50 border border-sand-300 text-xs text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                    />
                    <input
                      type="text"
                      value={editInstagram}
                      onChange={(e) => setEditInstagram(e.target.value)}
                      placeholder="@username_instagram"
                      className="w-full px-3 py-1.5 rounded-xl bg-sand-50 border border-sand-300 text-xs font-mono text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                    />
                    {(profile.role === "creator" || profile.role === "admin") && (
                      <div className="pt-1">
                        <label className="text-[10px] font-mono font-bold uppercase text-terracotta-700 block mb-1">
                          Custom Affiliate Tag ID:
                        </label>
                        <input
                          type="text"
                          value={editCustomAffiliateId}
                          onChange={(e) => setEditCustomAffiliateId(e.target.value)}
                          placeholder="misal: my_shopee_tag"
                          className="w-full px-3 py-1.5 rounded-xl bg-sand-50 border border-terracotta-300 text-xs font-mono font-bold text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="font-serif font-bold text-xl sm:text-2xl text-charcoal-900">
                        {profile.name}
                      </h1>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase ${privilege.badgeColor}`}>
                        {privilege.badgeLabel}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-sand-500 max-w-md">
                      {profile.bio}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-sand-400">
                      <span className="text-charcoal-900 font-medium">{profile.instagram}</span>
                      <span>•</span>
                      <button
                        onClick={handleCopyMemberId}
                        className="hover:text-charcoal-900 transition-colors flex items-center gap-1 bg-sand-50 px-2 py-0.5 rounded-md border border-sand-200"
                        title="Klik untuk salin ID Member"
                      >
                        <span>ID: #{profile.memberId}</span>
                        <Copy className="w-3 h-3 text-sand-500" />
                      </button>
                      <span>•</span>
                      <span>Bergabung {profile.memberSince}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap sm:flex-col items-end gap-2 shrink-0">
              {isEditing ? (
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Edit Profil</span>
                </button>
              )}

              {profile.role === "creator" && (
                <button
                  onClick={handleCopyCreatorLink}
                  className="px-3.5 py-1.5 rounded-xl bg-terracotta-50 hover:bg-terracotta-100 border border-terracotta-200 text-terracotta-700 font-bold text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3 h-3" />
                  <span>{copiedCreatorLink ? "Tersalin ✓" : "Bagikan Portofolio"}</span>
                </button>
              )}
            </div>
          </div>

          {/* XP & Style Level Progression Bar */}
          <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-charcoal-900">{levelTitle}</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-sand-500">
                {xp} / {nextLevelXp} XP ({xpPercent}%)
              </span>
            </div>

            <div className="w-full h-2.5 bg-sand-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-500 to-terracotta-500 rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-sand-500 pt-0.5">
              <span>Aktivitas Kurasi & Challenge Terakumulasi</span>
              <span className="text-terracotta-600 font-bold">+25 XP per Look Tersimpan</span>
            </div>
          </div>
        </motion.div>

        {/* 2. Role Privilege & Active Perks Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8DFD1] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-charcoal-900 text-white flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900">
                  Hak Akses & Privilege Role: {privilege.title}
                </h3>
                <p className="text-xs text-sand-500">
                  {privilege.description}
                </p>
              </div>
            </div>

            {profile.role === "free" && (
              <button
                onClick={() => handleSwitchRole("vip")}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-terracotta-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-95 transition-opacity shrink-0"
              >
                👑 Upgrade ke VIP Atelier ↗
              </button>
            )}

            {profile.role === "admin" && (
              <Link
                href="/admin"
                className="py-2 px-4 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>🛠️ Buka Fashion CMS (/admin)</span>
                <span>➔</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {privilege.perks.map((perk, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 flex items-center gap-2.5 text-xs"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="font-medium text-charcoal-900">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Key Metrics 4-Box Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFD1] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-sand-400">
              <Bookmark className="w-4 h-4 text-terracotta-500" />
              <span className="text-[9px] font-mono uppercase font-bold">LEMARI</span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              {summary.totalSaved}
            </div>
            <div className="text-[10px] text-sand-500">Formula OOTD Tersimpan</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFD1] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-sand-400">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[9px] font-mono uppercase font-bold">GENERASI</span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              {summary.totalGenerated}
            </div>
            <div className="text-[10px] text-sand-500">Total Kurasi AI</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFD1] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-sand-400">
              <Trophy className="w-4 h-4 text-terracotta-500" />
              <span className="text-[9px] font-mono uppercase font-bold">CHALLENGE</span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              {summary.totalVotesGiven}
            </div>
            <div className="text-[10px] text-sand-500">Vote Diberikan</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFD1] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-sand-400">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-[9px] font-mono uppercase font-bold">FAVORIT</span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              {summary.totalLikedLooks}
            </div>
            <div className="text-[10px] text-sand-500">Lookbook Disukai</div>
          </div>
        </div>

        {/* 3. Style DNA & Palet Warna Dominan */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Dominant Colors DNA (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                <span className="lookbook-label">STYLE DNA COLOR MATRIX</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900 mt-1">
                Palet Warna Dominan Kamu
              </h3>
              <p className="text-xs text-sand-500">
                Warna-warna yang paling sering kamu simpan dan cocok dengan iklim tropis harianmu.
              </p>
            </div>

            <div className="space-y-3">
              {dominantColors.map((col, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-black/15 shadow-2xs"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                      <span className="text-[10px] font-mono text-sand-400 uppercase">({col.hex})</span>
                    </div>
                    <span className="font-mono text-terracotta-600">{col.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-sand-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${col.percentage}%`,
                        backgroundColor: col.hex === "#FAF8F5" || col.hex === "#FFFFFF" ? "#BA5D38" : col.hex,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Vibe Radar (5 cols) */}
          <div className="md:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="lookbook-label">AESTHETIC VIBE RADAR</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900 mt-1">
                Karakter Estetika OOTD
              </h3>
              <p className="text-xs text-sand-500">
                Kecenderungan gaya busana dari riwayat kurasi.
              </p>
            </div>

            <div className="space-y-3">
              {vibeBreakdown.map((v, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-sand-50 border border-sand-200 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-charcoal-900">{v.vibe}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-sand-300 font-bold text-terracotta-600">
                      {v.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Monetisasi & Affiliate Insights (Role-Aware) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#181A18] to-[#2B2620] text-sand-50 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-terracotta-400" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-terracotta-300">
                  {profile.role === "creator" || profile.role === "admin"
                    ? "CREATOR MONETIZATION HUB"
                    : "SHOPPING & AFFILIATE INSIGHTS"}
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                {profile.role === "creator" || profile.role === "admin"
                  ? "Dashboard Komisi & Traffic Afiliasi Kamu"
                  : "Aktivitas Belanja & Eksplorasi Produk"}
              </h3>
              <p className="text-xs text-[#D7CABC]">
                {profile.role === "creator" || profile.role === "admin"
                  ? `Tag Afiliasi Aktif: af_id=${profile.customAffiliateId || "looku_ootd"} (Setiap klik dari link lookbook menghasilkan komisi)`
                  : "Statistik pencarian pakaian terkurasi di Shopee & Tokopedia melalui look.u"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-center">
                <div className="text-xl font-mono font-bold text-terracotta-400">
                  {affiliateStats.totalClicks}
                </div>
                <div className="text-[9px] font-mono text-sand-300 uppercase">Total Klik Belanja</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-center">
                <div className="text-xl font-mono font-bold text-emerald-400">
                  Rp {(affiliateStats.estimatedCommissionRp).toLocaleString("id-ID")}
                </div>
                <div className="text-[9px] font-mono text-sand-300 uppercase">Estimasi Nilai Kurasi</div>
              </div>
            </div>
          </div>

          {/* Breakdown Per Platform & Top Queries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Marketplace Terfavorit
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-orange-400 font-bold">
                  <span>🟠 Shopee</span>
                </span>
                <span className="font-mono font-bold text-white">{affiliateStats.shopeeClicks} klik</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span>🟢 Tokopedia</span>
                </span>
                <span className="font-mono font-bold text-white">{affiliateStats.tokopediaClicks} klik</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Pencarian Paling Sering
              </div>
              {affiliateStats.topQueries.length > 0 ? (
                <div className="space-y-1">
                  {affiliateStats.topQueries.slice(0, 3).map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-sand-300 truncate max-w-[180px]">• {t.query}</span>
                      <span className="font-mono text-terracotta-300">{t.count}x</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-sand-400 italic">
                  Belum ada riwayat klik produk. Klik tombol Shopee/Tokopedia di katalog busana!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 5. 30-Day Activity Heatmap */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-terracotta-500" />
                <span className="lookbook-label">30-DAY STYLE ACTIVITY</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900 mt-1">
                Jurnal Konsistensi OOTD
              </h3>
            </div>
            <span className="text-[10px] font-mono text-sand-500 uppercase">
              28 Hari Terakhir
            </span>
          </div>

          {/* Grid Squares */}
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2 pt-2">
            {activityHeatmap.map((day, idx) => {
              const active = day.count > 0;
              return (
                <div
                  key={idx}
                  title={`${day.date}: ${day.count} kurasi OOTD`}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[9px] font-mono transition-all ${
                    active
                      ? "bg-terracotta-500 text-white font-bold shadow-2xs scale-105"
                      : "bg-sand-100 text-sand-400 hover:bg-sand-200"
                  }`}
                >
                  {day.date.split("-")[2]}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] font-mono text-sand-400 text-right">
            Warna oranye menandakan hari aktif kurasi outfit harian
          </p>
        </div>

        {/* 6. Settings & Data Management */}
        <div className="p-6 rounded-3xl bg-sand-100 border border-sand-300 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-charcoal-900">
              Pengaturan & Pencadangan Data
            </h4>
            <span className="text-[10px] font-mono text-sand-500 uppercase">LOCAL-FIRST PRIVACY</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleExportData}
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-sand-200 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Ekspor Backup JSON</span>
            </button>

            <button
              onClick={handleResetData}
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data Lokal</span>
            </button>
          </div>
        </div>
      </main>

      {/* Docked Native Bottom Navigation Bar */}
      <BottomNav />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
