import { defineRouting } from "next-intl/routing";

export const locales = ["en", "zh", "ja", "ar", "th", "vi", "id"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // 默认语言 en 无前缀（/products），其余带前缀（/ar/products）
  localePrefix: "as-needed",
});

export const rtlLocales: readonly Locale[] = ["ar"];

export const localeMeta: Record<Locale, { label: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", dir: "ltr" },
  zh: { label: "中文", dir: "ltr" },
  ja: { label: "日本語", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
  th: { label: "ไทย", dir: "ltr" },
  vi: { label: "Tiếng Việt", dir: "ltr" },
  id: { label: "Bahasa Indonesia", dir: "ltr" },
};

export function getDir(locale: string): "ltr" | "rtl" {
  return rtlLocales.includes(locale as Locale) ? "rtl" : "ltr";
}
