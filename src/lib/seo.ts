import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";

/** 构建某 locale 下某逻辑路径的绝对 URL（en 无前缀，其余带前缀） */
export function urlFor(locale: string, path: string): string {
  const p = path === "/" ? "" : path;
  return locale === routing.defaultLocale
    ? `${SITE.url}${p}`
    : `${SITE.url}/${locale}${p}`;
}

/**
 * 生成 Next Metadata 的 alternates（canonical + hreflang + x-default）。
 * - path：不含 locale 前缀的逻辑路径，如 "/products/foo"、"/"
 * - availableLocales：该页已翻译并已生成的语言（默认全部）。未译语言不输出 hreflang，避免伪翻译污染。
 */
export function alternatesFor(
  path: string,
  currentLocale: string,
  availableLocales: readonly string[] = routing.locales,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const loc of availableLocales) languages[loc] = urlFor(loc, path);
  languages["x-default"] = urlFor(routing.defaultLocale, path);
  return { canonical: urlFor(currentLocale, path), languages };
}
