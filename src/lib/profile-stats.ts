import { OOTDRecommendation } from "./types";
import { getAffiliateStats, AffiliateStats } from "./affiliate";

export type UserRole = "free" | "vip" | "creator" | "admin";

export interface UserProfileData {
  name: string;
  bio: string;
  instagram: string;
  avatarId: string;
  skinToneId: string;
  memberSince: string;
  role: UserRole;
  memberId: string;
  customAffiliateId?: string;
  xp?: number;
  levelTitle?: string;
}

export interface RolePrivilege {
  role: UserRole;
  title: string;
  badgeLabel: string;
  badgeColor: string;
  description: string;
  perks: string[];
  maxWardrobeCapacity: number;
  hasCloudSync: boolean;
  hasCreatorMonetization: boolean;
  hasCustomAffiliateId: boolean;
  hasPriorityAI: boolean;
}

export const ROLE_PRIVILEGES: Record<UserRole, RolePrivilege> = {
  free: {
    role: "free",
    title: "Fashion Explorer",
    badgeLabel: "MEMBER GRATIS",
    badgeColor: "bg-sand-200 text-charcoal-900 border-sand-300",
    description: "Akses kurasi OOTD harian dasar berbasis cuaca dan lemari lokal.",
    perks: [
      "Kurasi OOTD Tropis 33°C & Sawo Matang",
      "Katalog 300+ Busana Lokal",
      "Lemari Koleksi Lokal (Hingga 20 Look)",
      "Ekspor Instagram Story Standar",
    ],
    maxWardrobeCapacity: 20,
    hasCloudSync: false,
    hasCreatorMonetization: false,
    hasCustomAffiliateId: false,
    hasPriorityAI: false,
  },
  vip: {
    role: "vip",
    title: "VIP Atelier Member",
    badgeLabel: "👑 VIP ATELIER",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300 shadow-glow",
    description: "Keanggotaan eksklusif akses awal dengan sinkronisasi cloud tanpa batas & AI prioritas.",
    perks: [
      "Semua Fitur Member Gratis",
      "Unlimited Google Cloud Wardrobe Sync",
      "Prioritas AI Stylist v2.5 Ultra-Fast",
      "3 Template Instagram Story Editorial & Streetwear",
      "Voucher Diskon Eksklusif Official Brand Lokal",
      "Side-by-Side Outfit Compare Engine",
    ],
    maxWardrobeCapacity: 9999,
    hasCloudSync: true,
    hasCreatorMonetization: false,
    hasCustomAffiliateId: false,
    hasPriorityAI: true,
  },
  creator: {
    role: "creator",
    title: "Verified Style Creator",
    badgeLabel: "✦ VERIFIED CREATOR",
    badgeColor: "bg-terracotta-100 text-terracotta-800 border-terracotta-300 shadow-sm",
    description: "Program kreator mode dengan dashboard monetisasi komisi & custom affiliate ID.",
    perks: [
      "Semua Fitur VIP Atelier",
      "Dashboard Monetisasi Afiliasi Shopee & Tokopedia",
      "Kustomisasi Custom Affiliate ID Pribadi",
      "Badge Centang Terverifikasi di Komunitas Challenge",
      "Laporan Traffic & Top Clicked Looks Real-time",
      "Tautan Portofolio Gaya Publik yang Siap Di-share",
    ],
    maxWardrobeCapacity: 9999,
    hasCloudSync: true,
    hasCreatorMonetization: true,
    hasCustomAffiliateId: true,
    hasPriorityAI: true,
  },
  admin: {
    role: "admin",
    title: "Atelier Platform Manager",
    badgeLabel: "🛠️ ADMIN / OWNER",
    badgeColor: "bg-charcoal-900 text-sand-50 border-charcoal-700 shadow-md",
    description: "Akses penuh pengelola startup, monitoring GMV affiliate platform & katalog sistem.",
    perks: [
      "Akses Penuh Seluruh Sistem & Modul",
      "Monitoring Total Platform Affiliate GMV",
      "Audit 300+ Katalog & Kurasi AI",
      "Manajemen Challenge Mingguan",
    ],
    maxWardrobeCapacity: 9999,
    hasCloudSync: true,
    hasCreatorMonetization: true,
    hasCustomAffiliateId: true,
    hasPriorityAI: true,
  },
};

export interface ColorDNAItem {
  hex: string;
  name: string;
  count: number;
  percentage: number;
}

export interface VibeRadarItem {
  vibe: string;
  count: number;
  percentage: number;
}

export interface ActivityDay {
  date: string;
  count: number;
}

export interface ProfileSummary {
  profile: UserProfileData;
  privilege: RolePrivilege;
  totalSaved: number;
  totalGenerated: number;
  totalVotesGiven: number;
  totalChallengeSubmissions: number;
  totalLikedLooks: number;
  dominantColors: ColorDNAItem[];
  vibeBreakdown: VibeRadarItem[];
  activityHeatmap: ActivityDay[];
  affiliateStats: AffiliateStats;
  styleConsistencyScore: number;
  dominantTone: string;
  xp: number;
  nextLevelXp: number;
  levelTitle: string;
}

export const DEFAULT_USER_PROFILE: UserProfileData = {
  name: "Fashion Enthusiast",
  bio: "Earthy Minimalist & Tropical Chic lover",
  instagram: "@fashionista",
  avatarId: "avatar-1",
  skinToneId: "tan",
  memberSince: "Agustus 2026",
  role: "vip",
  memberId: "LK-8821",
  customAffiliateId: "looku_ootd",
  xp: 380,
  levelTitle: "Style Explorer (Level 2)",
};

export function getStoredUserProfile(): UserProfileData {
  if (typeof window === "undefined") return DEFAULT_USER_PROFILE;
  try {
    const raw = localStorage.getItem("looku_user_profile");
    if (!raw) return DEFAULT_USER_PROFILE;
    return { ...DEFAULT_USER_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveStoredUserProfile(profile: Partial<UserProfileData>): UserProfileData {
  if (typeof window === "undefined") return DEFAULT_USER_PROFILE;
  try {
    const current = getStoredUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem("looku_user_profile", JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_profile_updated"));
    return updated;
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function calculateProfileSummary(): ProfileSummary {
  const profile = getStoredUserProfile();

  if (typeof window === "undefined") {
    const role = profile.role || "vip";
    return {
      profile,
      privilege: ROLE_PRIVILEGES[role] || ROLE_PRIVILEGES.free,
      totalSaved: 0,
      totalGenerated: 0,
      totalVotesGiven: 0,
      totalChallengeSubmissions: 0,
      totalLikedLooks: 0,
      dominantColors: [],
      vibeBreakdown: [],
      activityHeatmap: [],
      affiliateStats: getAffiliateStats(),
      styleConsistencyScore: 78,
      dominantTone: "Sawo Matang (Warm Undertone)",
      xp: 380,
      nextLevelXp: 450,
      levelTitle: "Style Explorer (Level 2)",
    };
  }

  let savedOutfits: OOTDRecommendation[] = [];
  try {
    savedOutfits = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
  } catch {
    savedOutfits = [];
  }

  let history: { id: string; timestamp: string; outfit: OOTDRecommendation }[] = [];
  try {
    history = JSON.parse(localStorage.getItem("looku_generation_history") || "[]");
  } catch {
    history = [];
  }

  let votedChallenges: string[] = [];
  try {
    votedChallenges = JSON.parse(localStorage.getItem("looku_voted_challenges") || "[]");
  } catch {
    votedChallenges = [];
  }

  let mySubmissions: string[] = [];
  try {
    mySubmissions = JSON.parse(localStorage.getItem("looku_my_challenge_ids") || "[]");
  } catch {
    mySubmissions = [];
  }

  let likedLooks: string[] = [];
  try {
    likedLooks = JSON.parse(localStorage.getItem("looku_liked_looks") || "[]");
  } catch {
    likedLooks = [];
  }

  const allOutfits = [...savedOutfits, ...history.map((h) => h.outfit)];
  const colorMap: Record<string, { hex: string; name: string; count: number }> = {};
  let totalColorCount = 0;

  allOutfits.forEach((o) => {
    if (o && o.colorPalette) {
      o.colorPalette.forEach((c) => {
        const hex = c.hex?.toUpperCase() || "#E8DFD1";
        const name = c.name || "Neutral";
        if (!colorMap[hex]) {
          colorMap[hex] = { hex, name, count: 0 };
        }
        colorMap[hex].count++;
        totalColorCount++;
      });
    }
  });

  const dominantColors: ColorDNAItem[] = Object.values(colorMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((c) => ({
      hex: c.hex,
      name: c.name,
      count: c.count,
      percentage: totalColorCount > 0 ? Math.round((c.count / totalColorCount) * 100) : 20,
    }));

  if (dominantColors.length === 0) {
    dominantColors.push(
      { hex: "#BA5D38", name: "Terracotta Earth", count: 1, percentage: 35 },
      { hex: "#8A9A86", name: "Sage Green", count: 1, percentage: 25 },
      { hex: "#E8DFD1", name: "Warm Sand", count: 1, percentage: 20 },
      { hex: "#2B2620", name: "Charcoal Deep", count: 1, percentage: 20 }
    );
  }

  const vibeMap: Record<string, number> = {};
  let totalVibes = 0;
  allOutfits.forEach((o) => {
    if (o && o.overallVibe) {
      const vibe = o.overallVibe.trim();
      vibeMap[vibe] = (vibeMap[vibe] || 0) + 1;
      totalVibes++;
    }
  });

  const vibeBreakdown: VibeRadarItem[] = Object.entries(vibeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([vibe, count]) => ({
      vibe,
      count,
      percentage: totalVibes > 0 ? Math.round((count / totalVibes) * 100) : 25,
    }));

  if (vibeBreakdown.length === 0) {
    vibeBreakdown.push(
      { vibe: "Earthy Minimalist", count: 1, percentage: 50 },
      { vibe: "Casual Clean", count: 1, percentage: 30 },
      { vibe: "Smart Formal", count: 1, percentage: 20 }
    );
  }

  const activityMap: Record<string, number> = {};
  const today = new Date();
  
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    activityMap[dateStr] = 0;
  }

  history.forEach((h) => {
    if (h.timestamp) {
      const dateStr = h.timestamp.split("T")[0];
      if (activityMap[dateStr] !== undefined) {
        activityMap[dateStr]++;
      }
    }
  });

  const todayStr = today.toISOString().split("T")[0];
  if (activityMap[todayStr] !== undefined) {
    activityMap[todayStr] = Math.max(activityMap[todayStr], 1);
  }

  const activityHeatmap: ActivityDay[] = Object.entries(activityMap).map(([date, count]) => ({
    date,
    count,
  }));

  const baseConsistency = 70;
  const historyBonus = Math.min(history.length * 2, 20);
  const wardrobeBonus = Math.min(savedOutfits.length * 2, 10);
  const styleConsistencyScore = Math.min(baseConsistency + historyBonus + wardrobeBonus, 98);

  const skinToneNames: Record<string, string> = {
    fair: "Putih Gading (Light Spring)",
    light: "Kuning Langsat (Neutral Spring)",
    medium: "Sawo Matang (Warm Autumn)",
    tan: "Tan Eksotis (Deep Autumn)",
    deep: "Deep Bronze (Deep Winter)",
  };

  const storedTone = localStorage.getItem("looku_personal_color") || profile.skinToneId || "tan";
  const dominantTone = skinToneNames[storedTone] || "Sawo Matang (Warm Undertone)";

  // Dynamic XP & Level Calculation
  const calculatedXp = 
    (savedOutfits.length * 25) + 
    (Math.max(history.length, 1) * 15) + 
    (votedChallenges.length * 10) + 
    (mySubmissions.length * 50) + 
    120;

  let levelTitle = "Fashion Novice (Level 1)";
  let nextLevelXp = 250;

  if (calculatedXp >= 750) {
    levelTitle = "Atelier Icon & Trendsetter (Level 4)";
    nextLevelXp = 1500;
  } else if (calculatedXp >= 450) {
    levelTitle = "Atelier Connoisseur (Level 3)";
    nextLevelXp = 750;
  } else if (calculatedXp >= 200) {
    levelTitle = "Style Explorer (Level 2)";
    nextLevelXp = 450;
  }

  const role = profile.role || "vip";
  const privilege = ROLE_PRIVILEGES[role] || ROLE_PRIVILEGES.free;

  return {
    profile: {
      ...profile,
      role,
      memberId: profile.memberId || "LK-8821",
      xp: calculatedXp,
      levelTitle,
    },
    privilege,
    totalSaved: savedOutfits.length,
    totalGenerated: Math.max(history.length, 1),
    totalVotesGiven: votedChallenges.length,
    totalChallengeSubmissions: mySubmissions.length,
    totalLikedLooks: likedLooks.length,
    dominantColors,
    vibeBreakdown,
    activityHeatmap,
    affiliateStats: getAffiliateStats(),
    styleConsistencyScore,
    dominantTone,
    xp: calculatedXp,
    nextLevelXp,
    levelTitle,
  };
}
