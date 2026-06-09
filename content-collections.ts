import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

// 多语言短文本：en 必填，其余可选（缺失时前端按 en 兜底）
const L = z.object({
  en: z.string(),
  zh: z.string().optional(),
  ja: z.string().optional(),
  ar: z.string().optional(),
  th: z.string().optional(),
  vi: z.string().optional(),
  id: z.string().optional(),
});

const products = defineCollection({
  name: "products",
  directory: "content/products",
  include: "**/*.json",
  parser: "json",
  schema: z.object({
    slug: z.string(),
    sku: z.string().optional(),
    name: L,
    tagline: L.optional(),
    category: z.enum(["audio", "wearables", "home", "accessories"]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    heroImage: z.string(), // public/ 下的路径，配 next/image
    gallery: z.array(z.string()).default([]),
    highlights: z.array(L).default([]),
    specs: z.array(z.object({ label: L, value: L })).default([]),
    buyLinks: z.object({
      amazonUrl: z.string().url().optional(),
      shopeeUrl: z.string().url().optional(),
      lazadaUrl: z.string().url().optional(),
      tiktokShopUrl: z.string().url().optional(),
    }),
    // 声明该产品"已完成翻译"的语言 —— 驱动只生成已译页面 + hreflang
    translatedLocales: z
      .array(z.enum(["zh", "ja", "ar", "th", "vi", "id"]))
      .default([]),
    seo: z
      .object({
        title: L.optional(),
        description: L.optional(),
        ogImage: z.string().optional(),
        noindex: z.boolean().default(false),
      })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  name: "pages",
  directory: "content/pages",
  include: "**/*.json",
  parser: "json",
  schema: z.object({
    key: z.string(), // 'about' | 'home-hero' | ...
    title: L,
    body: L.optional(),
    translatedLocales: z.array(z.string()).default([]),
  }),
});

export default defineConfig({ content: [products, pages] });
