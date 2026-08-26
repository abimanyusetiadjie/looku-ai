/**
 * Affiliate link generator & tracking engine untuk marketplace Indonesia (Shopee & Tokopedia)
 */

export interface AffiliateClickRecord {
  id: string;
  platform: "shopee" | "tokopedia";
  query: string;
  source: "catalog" | "outfit_card" | "chatbot" | "influencer_dupe" | "story" | "couple_card";
  timestamp: string;
}

export function getShopeeSearchUrl(
  query: string,
  customAffiliateId?: string,
  budgetTier?: string
): string {
  const affiliateId = customAffiliateId || process.env.NEXT_PUBLIC_SHOPEE_AFFILIATE_ID || "looku_ootd";
  const encodedQuery = encodeURIComponent(query.trim());
  
  let priceParams = "";
  if (budgetTier === "hemat" || budgetTier === "budget") {
    priceParams = "&minPrice=25000&maxPrice=99000";
  } else if (budgetTier === "menengah") {
    priceParams = "&minPrice=100000&maxPrice=250000";
  } else if (budgetTier === "premium" || budgetTier === "mall") {
    priceParams = "&minPrice=250000&maxPrice=750000";
  }

  return `https://shopee.co.id/search?keyword=${encodedQuery}${priceParams}&af_id=${affiliateId}&utm_source=looku_ai&utm_medium=affiliate`;
}

export function getTokopediaSearchUrl(
  query: string,
  customAffiliateId?: string,
  budgetTier?: string
): string {
  const affiliateId = customAffiliateId || process.env.NEXT_PUBLIC_TOKOPEDIA_AFFILIATE_ID || "looku_ootd";
  const encodedQuery = encodeURIComponent(query.trim());
  
  let priceParams = "";
  if (budgetTier === "hemat" || budgetTier === "budget") {
    priceParams = "&pmin=25000&pmax=99000";
  } else if (budgetTier === "menengah") {
    priceParams = "&pmin=100000&pmax=250000";
  } else if (budgetTier === "premium" || budgetTier === "mall") {
    priceParams = "&pmin=250000&pmax=750000";
  }

  return `https://www.tokopedia.com/search?st=product&q=${encodedQuery}${priceParams}&ref=${affiliateId}&utm_source=looku_ai&utm_medium=affiliate`;
}

export function getMarketplaceLinks(query: string, budgetTier?: string, customAffiliateId?: string) {
  return {
    shopee: getShopeeSearchUrl(query, customAffiliateId, budgetTier),
    tokopedia: getTokopediaSearchUrl(query, customAffiliateId, budgetTier),
  };
}

/**
 * Catat setiap klik affiliate belanja ke localStorage untuk analytics dashboard profil
 */
export function trackAffiliateClick(
  platform: "shopee" | "tokopedia",
  query: string,
  source: AffiliateClickRecord["source"]
): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem("looku_affiliate_clicks");
    const clicks: AffiliateClickRecord[] = raw ? JSON.parse(raw) : [];

    const record: AffiliateClickRecord = {
      id: `aff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      platform,
      query,
      source,
      timestamp: new Date().toISOString(),
    };

    // Simpan maksimal 100 klik terakhir
    const updated = [record, ...clicks].slice(0, 100);
    localStorage.setItem("looku_affiliate_clicks", JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_affiliate_click_recorded"));
  } catch (err) {
    console.error("Gagal mencatat klik affiliate:", err);
  }
}

export interface AffiliateStats {
  totalClicks: number;
  shopeeClicks: number;
  tokopediaClicks: number;
  topQueries: { query: string; count: number }[];
  clicksBySource: Record<AffiliateClickRecord["source"], number>;
  estimatedCommissionRp: number; // Estimasi potensi GMV / komisi (Rp)
}

/**
 * Dapatkan analitik klik affiliate pengguna
 */
export function getAffiliateStats(): AffiliateStats {
  if (typeof window === "undefined") {
    return {
      totalClicks: 0,
      shopeeClicks: 0,
      tokopediaClicks: 0,
      topQueries: [],
      clicksBySource: {
        catalog: 0,
        outfit_card: 0,
        chatbot: 0,
        influencer_dupe: 0,
        story: 0,
        couple_card: 0,
      },
      estimatedCommissionRp: 0,
    };
  }

  try {
    const raw = localStorage.getItem("looku_affiliate_clicks");
    const clicks: AffiliateClickRecord[] = raw ? JSON.parse(raw) : [];

    const shopeeClicks = clicks.filter((c) => c.platform === "shopee").length;
    const tokopediaClicks = clicks.filter((c) => c.platform === "tokopedia").length;

    const queryCounts: Record<string, number> = {};
    const clicksBySource: Record<AffiliateClickRecord["source"], number> = {
      catalog: 0,
      outfit_card: 0,
      chatbot: 0,
      influencer_dupe: 0,
      story: 0,
      couple_card: 0,
    };

    clicks.forEach((c) => {
      queryCounts[c.query] = (queryCounts[c.query] || 0) + 1;
      if (clicksBySource[c.source] !== undefined) {
        clicksBySource[c.source]++;
      }
    });

    const topQueries = Object.entries(queryCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Asumsi komisi rata-rata 3% dari rata-rata order Rp 120.000 (Rp 3.600 / checkout intent)
    const estimatedCommissionRp = clicks.length * 3600;

    return {
      totalClicks: clicks.length,
      shopeeClicks,
      tokopediaClicks,
      topQueries,
      clicksBySource,
      estimatedCommissionRp,
    };
  } catch (err) {
    console.error("Gagal membaca affiliate stats:", err);
    return {
      totalClicks: 0,
      shopeeClicks: 0,
      tokopediaClicks: 0,
      topQueries: [],
      clicksBySource: {
        catalog: 0,
        outfit_card: 0,
        chatbot: 0,
        influencer_dupe: 0,
        story: 0,
        couple_card: 0,
      },
      estimatedCommissionRp: 0,
    };
  }
}
