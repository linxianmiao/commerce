import type { Locale } from "@/i18n/routing";

// content-collections 推断的多语言字段形如 { en: string; zh?: string; ... }
type Localized = { en: string } & Partial<Record<string, string>>;

/** 取某语言文案，缺失则回退到 en（仅用于 UI 兜底显示） */
export function tx(field: Localized | undefined, locale: string): string {
  if (!field) return "";
  return field[locale] ?? field.en ?? "";
}

/** 该条内容声明已翻译的语言集合（含默认 en） */
export function availableLocales(translatedLocales: readonly string[]): Locale[] {
  return ["en", ...translatedLocales] as Locale[];
}
