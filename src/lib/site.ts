// 站点级常量（品牌名等）。集中定义，便于统一修改。
export const SITE = {
  name: "Meridian",
  // 生产部署时改为正式域名（影响 canonical / hreflang / sitemap 绝对 URL）
  url: "https://www.example.com",
  // 产品外链平台的展示名（用于 "Buy on {platform}"）
  platforms: {
    amazonUrl: "Amazon",
    shopeeUrl: "Shopee",
    lazadaUrl: "Lazada",
    tiktokShopUrl: "TikTok Shop",
  } as const,
} as const;

export type BuyPlatformKey = keyof typeof SITE.platforms;
