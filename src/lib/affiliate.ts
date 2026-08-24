/**
 * Affiliate link generator untuk marketplace Indonesia (Shopee & Tokopedia)
 */

export function getShopeeSearchUrl(query: string, customAffiliateId?: string): string {
  const affiliateId = customAffiliateId || process.env.NEXT_PUBLIC_SHOPEE_AFFILIATE_ID || "looku_ootd";
  const encodedQuery = encodeURIComponent(query.trim());
  
  return `https://shopee.co.id/search?keyword=${encodedQuery}&af_id=${affiliateId}&utm_source=looku_ai&utm_medium=affiliate`;
}

export function getTokopediaSearchUrl(query: string, customAffiliateId?: string): string {
  const affiliateId = customAffiliateId || process.env.NEXT_PUBLIC_TOKOPEDIA_AFFILIATE_ID || "looku_ootd";
  const encodedQuery = encodeURIComponent(query.trim());
  
  return `https://www.tokopedia.com/search?st=product&q=${encodedQuery}&ref=${affiliateId}&utm_source=looku_ai&utm_medium=affiliate`;
}

export function getMarketplaceLinks(query: string) {
  return {
    shopee: getShopeeSearchUrl(query),
    tokopedia: getTokopediaSearchUrl(query),
  };
}
