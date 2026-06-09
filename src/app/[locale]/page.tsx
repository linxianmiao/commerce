import { setRequestLocale, getTranslations } from "next-intl/server";
import { allPages } from "content-collections";
import { Link } from "@/i18n/navigation";
import { getProducts } from "@/lib/products";
import { tx } from "@/lib/i18n-content";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "@/components/icons";
import { SITE } from "@/lib/site";
import { alternatesFor } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternatesFor("/", locale) };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const hero = allPages.find((p) => p.key === "home-hero");
  const products = getProducts();

  return (
    <main>
      {/* Hero — 左对齐大号标题（anti-center） */}
      <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-12 md:pt-24 lg:pt-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
            {hero ? tx(hero.title, locale) : SITE.name}
          </h1>
          {hero?.body && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
              {tx(hero.body, locale)}
            </p>
          )}
          <Link
            href="/products"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-foreground py-2 ps-6 pe-2 text-base font-medium text-background transition-colors hover:bg-foreground/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span>{t("home.exploreProducts")}</span>
            <span className="grid size-9 place-items-center rounded-full bg-background/15 transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="size-4 flip-rtl" />
            </span>
          </Link>
        </div>
      </section>

      {/* 产品展示 */}
      <section className="mx-auto max-w-[1400px] px-6 pb-20">
        <div className="flex items-end justify-between gap-6 border-t border-border pt-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {t("home.featuredTitle")}
          </h2>
          <Link
            href="/products"
            className="hidden shrink-0 items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground sm:inline-flex"
          >
            {t("products.title")}
            <ArrowRight className="size-4 flip-rtl" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} locale={locale} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
