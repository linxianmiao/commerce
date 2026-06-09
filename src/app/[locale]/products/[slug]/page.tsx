import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProducts, getProduct } from "@/lib/products";
import { tx } from "@/lib/i18n-content";
import { alternatesFor, urlFor } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { BuyButtons } from "@/components/buy-buttons";
import { ArrowRight, Check } from "@/components/icons";

// 仅生成「en + 已翻译语言」的组合；其余 locale 返回 404，杜绝伪翻译页
export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().flatMap((p) =>
    ["en", ...p.translatedLocales].map((locale) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const name = tx(product.name, locale);
  const description = product.seo?.description
    ? tx(product.seo.description, locale)
    : product.tagline
      ? tx(product.tagline, locale)
      : name;
  const available = ["en", ...product.translatedLocales];

  return {
    title: product.seo?.title ? tx(product.seo.title, locale) : name,
    description,
    alternates: alternatesFor(`/products/${slug}`, locale, available),
    openGraph: {
      title: name,
      description,
      type: "website",
      images: [`${SITE.url}${product.heroImage}`],
    },
    robots: product.seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProduct(slug);
  if (!product) notFound();
  const t = await getTranslations("product");

  const name = tx(product.name, locale);
  const description = product.tagline ? tx(product.tagline, locale) : name;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `${SITE.url}${product.heroImage}`,
    ...(product.sku ? { sku: product.sku } : {}),
    brand: { "@type": "Brand", name: SITE.name },
    url: urlFor(locale, `/products/${product.slug}`),
  };

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-12 md:py-16">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowRight className="size-4 rotate-180 rtl:rotate-0" />
        {t("backToProducts")}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* 主图（double-bezel） */}
        <div className="rounded-[2rem] bg-foreground/[0.03] p-2 ring-1 ring-foreground/[0.06]">
          <div className="overflow-hidden rounded-[calc(2rem-0.5rem)] bg-surface shadow-[0_24px_50px_-28px_rgba(0,0,0,0.25)]">
            <Image
              src={product.heroImage}
              alt={name}
              width={1100}
              height={1100}
              priority
              className="aspect-square size-full object-cover"
            />
          </div>
        </div>

        {/* 信息 */}
        <div className="lg:py-4">
          <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {name}
          </h1>
          {product.tagline && (
            <p className="mt-3 text-lg text-muted text-pretty">
              {tx(product.tagline, locale)}
            </p>
          )}

          {product.highlights.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
                {t("highlights")}
              </h2>
              <ul className="mt-4 space-y-3">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-accent" />
                    <span className="text-pretty">{tx(h, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted">
              {t("availableOn")}
            </p>
            <BuyButtons buyLinks={product.buyLinks} />
          </div>
        </div>
      </div>

      {/* 规格 */}
      {product.specs.length > 0 && (
        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-semibold tracking-tight">
            {t("specifications")}
          </h2>
          <dl className="mt-6 border-t border-border">
            {product.specs.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-8 border-b border-border py-4"
              >
                <dt className="text-muted">{tx(s.label, locale)}</dt>
                <dd className="font-medium text-end tabular-nums">
                  {tx(s.value, locale)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
