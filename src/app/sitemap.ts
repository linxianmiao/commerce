import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProducts } from "@/lib/products";
import { urlFor } from "@/lib/seo";

function languagesFor(path: string, locales: readonly string[]) {
  return Object.fromEntries(locales.map((l) => [l, urlFor(l, path)]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // 静态页：全语言可用
  for (const path of ["/", "/products", "/about"]) {
    entries.push({
      url: urlFor(routing.defaultLocale, path),
      alternates: { languages: languagesFor(path, routing.locales) },
    });
  }

  // 产品详情页：仅 en + 已翻译语言（与 generateStaticParams 一致）
  for (const p of getProducts()) {
    const path = `/products/${p.slug}`;
    const available = ["en", ...p.translatedLocales];
    entries.push({
      url: urlFor(routing.defaultLocale, path),
      alternates: { languages: languagesFor(path, available) },
    });
  }

  return entries;
}
