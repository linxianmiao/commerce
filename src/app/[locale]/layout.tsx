import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import { routing, getDir } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site";
import "../globals.css";

// 拉丁品牌字体（自托管、消除布局抖动）；CJK/阿语/泰语走系统字体栈（见 globals.css）
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.example.com"),
  title: { default: `${SITE.name} — Premium gadgets`, template: `%s · ${SITE.name}` },
  description: "Premium consumer electronics, designed in-house and trusted worldwide.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // 启用静态渲染（SSG）
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={getDir(locale)}
      className={`${geist.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-[100dvh] flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
