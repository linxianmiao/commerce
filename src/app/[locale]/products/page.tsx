import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternatesFor("/products", locale),
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const products = getProducts();

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted text-pretty">{t("subtitle")}</p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} locale={locale} index={i} />
        ))}
      </div>
    </main>
  );
}
