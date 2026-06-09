import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { allPages } from "content-collections";
import { tx } from "@/lib/i18n-content";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), alternates: alternatesFor("/about", locale) };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const page = allPages.find((p) => p.key === "about");

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
        {page ? tx(page.title, locale) : t("about.title")}
      </h1>
      {page?.body && (
        <p className="mt-8 text-lg leading-relaxed text-muted text-pretty">
          {tx(page.body, locale)}
        </p>
      )}
    </main>
  );
}
